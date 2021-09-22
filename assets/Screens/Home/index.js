import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { StyleSheet, Text, View, Image, Dimensions, TextInput, Clipboard } from 'react-native';
import { useFonts, Archivo_700Bold, Archivo_500Medium, Archivo_400Regular} from '@expo-google-fonts/archivo';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useTheme } from '@react-navigation/native';

var formWidth = (Dimensions.get('window').width / 100) * 80;
var width = Dimensions.get('window').width;

export default function Home({route, navigation}) {
  let [fontsLoaded] = useFonts({
    Archivo_700Bold, Archivo_500Medium, Archivo_400Regular
  });

  const IsFocused = useIsFocused();
  const [isEditing, setIsEditing] = useState(false);
  const { colors } = useTheme();
  
  const [links, setLinks] = useState([]);
  const [linkInput, onChangeLinkInput] = useState("");
  const [linkNameInput, onChangeLinkNameInput] = useState("");

  useEffect(() => {
    if(IsFocused)
      loadAllLinks();
  }, [IsFocused]);

  useEffect(() => {
    saveAllLinks();
  }, [links]);

  useEffect(() => {
    if(route.params?.editItem)
    {
      setIsEditing(true);
      onChangeLinkNameInput(route.params?.editItem.name);
    }
  }, [route.params?.editItem])

  const short = async () => {
    if(linkInput == "" && linkNameInput == "")
    {
      alert('Preencha os campos!!');
      return;
    }

    if(linkInput.includes('https://') || linkInput.includes('http://'))
    {
      await fetch(`https://cutt.ly/api/api.php?key=29ebbfbf51d5f759e4c65032a135e62597db8&short=${linkInput}&name=${linkNameInput}`)
        .then(async response => {
          const data = await response.json();

          if(data.url.status === 3)
          {
            alert('Esse nome já esta em uso, utilize outro !!');
            return;
          }

          if(data.url.status === 2)
          {
            alert('Esse link não é válido');
            return;
          }

          const item = {
            name: linkNameInput,
            link: data.url.fullLink,
            creationDate: new Date().toDateString(),
            shortenLink: data.url.shortLink,
            isFavorite: false
          }

          //The link is copied to clipboard and is displayed one Toast talking that the link was copied
          Clipboard.setString(item.shortenLink);
          Toast.show('Seu link foi encurtado e copiado para área de transferência!', Toast.LONG);

          setLinks([...links, item]);

          //Clear all inputs
          onChangeLinkInput("");
          onChangeLinkNameInput("");
        })
    }
  }

  const edit = async () => {
    if(linkNameInput == "")
    {
      alert('Preencha os campos!!');
      return;
    }

    if(linkNameInput == route.params?.editItem.name)
    {
      alert('Esse já é o nome atual!!');
      return;
    }

    //Edit link name
    let Items = links;
    var index = 0;

    Items.forEach(function(item, i) {
      if(item = route.params?.editItem)
      {
        index = i;
      }
    });
    Items[index].name = linkNameInput;

    //Update all links
    setLinks(Items);
    saveAllLinks();

    onChangeLinkNameInput("");
    setIsEditing(false);
    //Is displayed one Toast talking that the link name was edited
    Toast.show('O nome do seu link foi editado!!', Toast.LONG);
  }

  async function saveAllLinks()
  {
    await AsyncStorage.setItem("Data", JSON.stringify(links));
  }

  async function loadAllLinks()
  {
    const allLinks = await AsyncStorage.getItem("Data");

    if(allLinks)
      setLinks(JSON.parse(allLinks));
  }

  if(!fontsLoaded)
  {
    return <AppLoading/>
  }
  else{
    return (
      <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
        <StatusBar barStyle={colors.statusBar} translucent backgroundColor="transparent"/>

        {/*App Logo*/}
        <View style={{width: width/2.3, marginLeft: 'auto', marginRight: 'auto', alignItems: 'center'}}>
          <View style={styles.appLogo}>
            <Image style={{width: 150, height: 150}} source={require('../../img/LinkIcon.png')}/>
          </View>
          <Text style={{fontFamily: 'Archivo_700Bold', fontSize: 42, color: "#D446C6", 
          marginTop: 10}}>Encurte</Text>
          <Text style={{fontFamily: 'Archivo_700Bold', fontSize: 30, color: "white", marginTop: -15,
          textAlign: 'right'}}>seus links</Text>
        </View>

        {/*Shortened links creation form*/}
        <View style={{width: formWidth, marginLeft: 'auto', marginRight: 'auto', marginTop: 10}}>
          {/*Link Input(Link) - The View checks whether it's creating or editing*/}
          <View style={isEditing ? {display: 'none'} : {}}>
            <Text style={styles.text_style}>Insira seu link</Text>
            <TextInput value={linkInput} onChangeText={onChangeLinkInput} placeholder={"Ex: www.exemplo.com"} 
            style={[styles.inputs, {backgroundColor: colors.secondBackgroundColor, color: colors.text}]}></TextInput>
          </View>

          {/*Link Input(Name)*/}
          <Text style={[styles.text_style, {marginTop: 20}]}>Nome personalizado</Text>
          <TextInput value={linkNameInput} onChangeText={onChangeLinkNameInput} placeholder={"Ex: Meu link encurtado"} 
          style={[styles.inputs, {backgroundColor: colors.secondBackgroundColor, color: colors.text}]}></TextInput>

          {/*Button*/}
          <View style={styles.button}>
            <TouchableHighlight underlayColor="transparent" activeOpacity={0.5} useForeground={true} onPress={isEditing ? () => edit() : ()=> short()}>
              <View style={{height: 50, justifyContent: 'center', alignItems: 'center', width: formWidth}}>
                <Text style={{fontFamily: 'Archivo_700Bold', fontSize: 20, color: 'white'}}>{isEditing ? "Editar link" : "Encurtar Link"}</Text>
              </View>
            </TouchableHighlight>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  appLogo:{
    width: 160,
    height: 160,
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor:'black',
    shadowOffset: {
      width: 10,
      height: 10
    },
    shadowRadius: 5,
    shadowOpacity: 0.5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputs:{
    height: 60,
    width: "100%",
    borderRadius: 10,
    padding: 20,
    fontFamily: 'Archivo_400Regular',
    fontSize: 15
  },
  button:{
    height: 50,
    borderRadius: 100,
    backgroundColor: "#D446C6",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    overflow: 'hidden'
  },
  text_style:{
    fontFamily: 'Archivo_500Medium', 
    fontSize: 16, 
    color: "#D446C6",
    marginLeft: 10
  }
});
