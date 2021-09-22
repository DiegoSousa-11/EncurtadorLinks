import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, FlatList, Clipboard, Share, Alert, Image, TextInput } from 'react-native';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { format } from 'date-fns';

var formWidth = (Dimensions.get('window').width / 100) * 80;
var height = Dimensions.get('window').height;

export default function Search({navigation}) {  
    const IsFocused = useIsFocused();
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [links, setLinks] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);
    const [linksModalVisible, setLinksModalVisible] = useState(false);
    const [modalLinkItem, setModalLinkItem] = useState([{}]);

    const copyToClipboard = (link) => {
        Clipboard.setString(link);
        Toast.show('Seu link foi copiado para área de transferência!', Toast.LONG);
    };

    const onShare = async () => {
        try{
            const result = await Share.share({
                message: modalLinkItem.name + ": " + modalLinkItem.shortenLink,
            });
        }
        catch{
            alert('Não foi possível compartilhar esse link !!');
        }
    }

    const addFavorite = () => {
        let Items = links;

        Items.forEach(function(item){
            if(item == modalLinkItem)
                item.isFavorite = !item.isFavorite;
        })

        Toast.show(modalLinkItem.isFavorite ? 'Adicionado aos favoritos!' : "Removido dos favoritos", Toast.SHORT);

        setLinksModalVisible(false);
        setLinks(Items);
        saveAllLinks();
    }

    const goEdit = () => {
        navigation.navigate("HomeScreen", {editItem: modalLinkItem});
        screenController(true);
    }

    useEffect(() => {
        if(IsFocused)
            loadData();
        else
            setSearchInput("");
    }, [IsFocused])

    useEffect(() => {
        if(searchInput == "")
            setResults([]);
        else{
            setResults(
                links.filter(item => {
                    if(item.name.toLocaleLowerCase().indexOf(searchInput.toLocaleLowerCase()) > -1)
                        return true;
                    else
                        return false;
                })
            );
        }
    }, [searchInput])

    useEffect(() => {
        saveAllLinks();
      }, [links]);

    async function loadData()
    {
        const allLinks = JSON.parse(await AsyncStorage.getItem("Data"));
        setLinks(allLinks); //keep links
        setIsLoading(false);
    }

    async function saveAllLinks()
    {
      await AsyncStorage.setItem("Data", JSON.stringify(links));
    }

    function OpenModal(item)
    {
        setModalLinkItem(item);
        setLinksModalVisible(true);
    }

    function deleteLink()
    {
        setLinksModalVisible(false);

        Alert.alert(
            "Deletar link",
            "Você tem certeza que deseja deletar esse link permanentemente?",
            [
                {
                    text: "Não",
                    onPress: () => {return} 
                },
                {
                    text: "Sim",
                    onPress: () => {
                        //Delete link
                        const items = links.filter(links => links !== modalLinkItem);
                        setLinks(items);
                    }
                }
            ]
        )
    }

    if(isLoading)
    {
      return (
        <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
            <ActivityIndicator size='large' style={{marginTop: (height-120)/2}} animating={true} color='#D446C6'/>
        </View>
      )
    }
    else
    {
        return(
            <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
                <StatusBar barStyle={colors.statusBar} translucent backgroundColor="transparent"/>
                <View style={{flexDirection: "row"}}>
                    <View style={[styles.icon_background, {backgroundColor: colors.secondBackgroundColor}]}>
                        <Icon color={colors.text} name="search" size={25}/>
                    </View>
                    <TextInput value={searchInput} onChangeText={(t) => setSearchInput(t)} placeholder="Pesquisar" 
                    style={[styles.searchInput, {backgroundColor: colors.secondBackgroundColor, color: colors.text}]}/>
                </View>

                {
                    results == "" ?
                    <View style={{marginTop: height/6.5}}>
                        <Text style={{fontFamily: 'Archivo_700Bold', fontSize: 25, 
                        width: formWidth, textAlign: 'center', color: '#B5B5B5'}}>{searchInput == "" ? "Pesquise entre seus links encurtados" : "Nenhum resultado encontrado"}</Text>
                        <Image style={[{width: formWidth/1.2, height: formWidth/1.67, marginTop: 30}, searchInput == "" ? {left: 40} : {}]} 
                        source={searchInput == "" ? require('../../img/SearchImage.png') : require('../../img/SearchingImage.png')}/>
                    </View>
                    :
                    <View/>
                }

                <FlatList data={results} keyExtractor={(item) => item.name} renderItem={({item}) => (
                    <View style={{alignItems: 'center'}}>
                        <View style={{width: formWidth}}>
                            <Text numberOfLines={1} style={[styles.text_style, {marginTop: 20}]}>{item.name}</Text>
                            <View style={{flexDirection: 'row'}}>
                                {/*Link input*/}
                                <View style={{overflow: 'hidden', borderRadius: 10, width: "79%"}}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => OpenModal(item)}>
                                        <View style={styles.inputs}>
                                            <Text numberOfLines={1} style={{color: '#959595'}}>{item.shortenLink}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {/*Copy button*/}
                                <View style={styles.copy_button}>
                                    <TouchableOpacity onPress={() => copyToClipboard(item.shortenLink)}>
                                        <View style={{height: 60, width: 60, justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon2 name="content-copy" size={28} color="#D446C6"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}/>

                <Modal style={{height: height}} isVisible={linksModalVisible} onBackdropPress={() => setLinksModalVisible(false)}>
                    <View style={styles.modal_style}>
                        <View style={{flexDirection: "row", alignItems: 'center'}}>
                            {/*Close button*/}
                            <View style={styles.button}>
                                <TouchableOpacity onPress={() => setLinksModalVisible(false)}>
                                    <View style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon2 onPress={() => setLinksModalVisible(false)} name="close" size={30} color="#D446C6"/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginLeft: 'auto'}}>
                                {/*Edit and Share buttons*/}
                                <View style={{flexDirection: 'row'}}>
                                    <Icon2 onPress={addFavorite} name={modalLinkItem.isFavorite ? "star" : "star-outline"} size={28} color="#D446C6"/>
                                    <Icon2 onPress={goEdit} style={{marginLeft: 10}} name="pencil-outline" size={28} color="#D446C6"/>
                                    <Icon2 onPress={onShare} style={{marginLeft: 10}} name="share-outline" size={28} color="#D446C6"/>
                                </View>
                            </View>
                        </View>
                        {/*Link name*/}
                        <Text style={styles.modal_nameLink}>{modalLinkItem.name}</Text>
                        {/*Link creation date*/}
                        <View style={{height: 30, width: 160, padding: 10, alignItems: 'center', borderWidth: 1.5, 
                        borderColor: "#D446C6", borderRadius: 100, flexDirection: 'row', marginTop: 10, marginLeft: 8}}>
                            <Icon2 name="calendar-blank" size={19} color="#D446C6"/>
                            <View style={{height: 30, width: 1.5, backgroundColor: '#D446C6', marginLeft: 4, marginRight: 5}}></View>
                            <Text style={styles.modal_links}>{modalLinkItem.creationDate ? format(new Date(modalLinkItem.creationDate), "dd/MM/yyyy") : ""}</Text>
                        </View>
                        {/*Shortened Link*/}
                        <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 10}}>
                            <Icon2 name="link" size={25} color="#D446C6"/>
                            <Text onPress={() => copyToClipboard(modalLinkItem.shortenLink)} style={styles.modal_links}>{modalLinkItem.shortenLink}</Text>
                        </View>
                        {/*Normal Link*/}
                        <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 10}}>
                            <Icon2 name="link-off" size={25} color="#858585"/>
                            <Text onPress={() => copyToClipboard(modalLinkItem.link)} style={[styles.modal_links, {color: "#858585"}]}>{modalLinkItem.link}</Text>
                        </View>
                        {/*Delete button*/}
                        <View style={[styles.copy_button, {height: 30, width: 90, backgroundColor: "#D446C6", marginTop: 15, marginLeft: "auto"}]}>
                            <TouchableOpacity onPress={() => deleteLink()} useForeground={true}>
                                <View style={{height: 30, width: 90, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text onPress={() => deleteLink()} style={{color: "white", fontFamily: "Archivo_700Bold", fontSize: 16}}>Excluir</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    searchInput: {
        width: (formWidth/100) * 85,
        height: 60,
        paddingRight: 20,
        marginTop: 60,
        fontFamily: 'Archivo_400Regular',
        fontSize: 18,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },
    icon_background: {
        width: (formWidth/100) * 15,
        height: 60,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputs:{
        height: 60,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        fontFamily: 'Archivo_400Regular',
        fontSize: 15
    },
    text_style:{
        fontFamily: 'Archivo_500Medium', 
        fontSize: 16, 
        color: "#D446C6",
        marginLeft: 10,
        width: formWidth - 85
    },
    copy_button:{
        height: 58,
        width: 58,
        backgroundColor: '#E0B1DB',
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    modal_style:{
        backgroundColor: 'white', 
        padding: 30,
        width: formWidth,
        marginRight: 'auto',
        marginLeft: 'auto'
    },
    modal_nameLink: {
        fontFamily: "Archivo_700Bold",
        fontSize: 22,
        color: "#D446C6",
        marginLeft: 5,
        marginTop: 20
    },
    modal_links: {
        fontFamily: "Archivo_500Medium",
        fontSize: 18,
        color: "#D446C6",
        marginLeft: 5,
        width: formWidth - 80
    },
    button:{
        height: 40,
        width: 40,
        borderWidth: 2,
        borderColor: "#D446C6",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
})