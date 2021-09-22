import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, FlatList, Clipboard, Share, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import { ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compareAsc, compareDesc, format } from 'date-fns';
import { useIsFocused, useTheme } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native';

var formWidth = (Dimensions.get('window').width / 100) * 80;
var height = Dimensions.get('window').height;

export default function MyLinks({navigation}) {
    const IsFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const { colors } = useTheme();

    const [links, setLinks] = useState([]);
    const [linksModalVisible, setLinksModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [modalLinkItem, setModalLinkItem] = useState([{}]);
    const [filteredLinks, setFilteredLinks] = useState([]);

    const [onlyFavorite, setOnlyFavorite] = useState(false);
    const [isAlphabeticalOrder, setIsAlphabeticalOrder] = useState(false);
    const [isOlder, setIsOlder] = useState(false);
    const [isNewest, setIsNewest] = useState(false);
    
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
        filtrate();
        saveAllLinks();
    }

    const goEdit = () => {
        navigation.navigate("HomeScreen", {editItem: modalLinkItem});
        screenController(true);
    }

    useEffect(() => {
        if(IsFocused)
        {
            setIsLoading(true);
            loadAllLinks();
        }
    }, [IsFocused]);

    useEffect(() => {
        filtrate();
        saveAllLinks();
      }, [links]);

    async function loadAllLinks()
    {
        const allLinks = await AsyncStorage.getItem("Data");

        if(allLinks)
            setLinks(JSON.parse(allLinks));
        else
            setLinks([]);

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

    function clearFilter()
    {
        setIsAlphabeticalOrder(false);
        setIsNewest(false);
        setIsOlder(false);
    }

    function closeFilterModal()
    {
        setFilterModalVisible(false);
        filtrate();
    }

    function filtrate()
    {
        let items = [...links];

        //Sort alphabetically
        if(isAlphabeticalOrder)
            items.sort((a, b) => (a.name > b.name) ? 1 : (b.name > a.name) ? -1 : 0);

        //Sort from newest to oldest 
        if(isNewest)
            items.sort((a, b) => compareAsc(new Date(a.creationDate), new Date(b.creationDate)));

        //Sort from oldest to newest
        if(isOlder)
            items.sort((a, b) => compareDesc(new Date(a.creationDate), new Date(b.creationDate)));

        //Show only favorite links
        if(onlyFavorite)
            items = items.filter(items => items.isFavorite == true);

        setFilteredLinks(items);
    }

    if(isLoading)
    {
      return (
        <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
            <ActivityIndicator size='large' style={{marginTop: (height-120)/2}} animating={true} color='#D446C6'/>
        </View>
      )
    }
    if(links == "")
    {
        return(
            <View style={{flex: 1, backgroundColor: colors.backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'Archivo_700Bold', fontSize: 25, 
                width: formWidth, textAlign: 'center', color: '#B5B5B5'}}>Nenhum link encontrado</Text>
                <Image style={{width: formWidth/1.6, height: formWidth/1.73, marginTop: 30}} source={require('../../img/noLinks.png')}/>
            </View>
        )
    }
    else{
        return (
            <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
                <StatusBar barStyle={colors.statusBar} translucent backgroundColor="transparent"/>
                    <View style={styles.filter}>
                        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                            <View style={{height: 40, width: 40, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon name="filter-variant" size={32} color="#D446C6"/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {
                        //If there is no match to the filter
                        filteredLinks == "" ? 
                        <View style={{flex: 1, backgroundColor: '#E5E5E5', justifyContent: 'center', 
                        alignItems: 'center', marginTop: height/4}}>
                            <Text style={{fontFamily: 'Archivo_700Bold', fontSize: 25, 
                            width: formWidth, textAlign: 'center', color: '#B5B5B5'}}>Nenhum link encontrado com esse filtro</Text>
                            <Image style={{width: formWidth/1.6, height: formWidth/1.73, marginTop: 30}} source={require('../../img/noLinks.png')}/>
                        </View>
                        :
                        <View/>
                    }

                    <FlatList data={filteredLinks} keyExtractor={(item) => item.name} renderItem={({item}) => (
                        <View style={{alignItems: 'center'}}>
                            <View style={{width: formWidth}}>
                                <Text numberOfLines={1} style={[styles.text_style, {marginTop: 20}]}>{item.name}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    {/*Link input*/}
                                    <View style={{overflow: 'hidden', borderRadius: 10, width: "80%"}}>
                                        <TouchableOpacity activeOpacity={0.7} useForeground={true} onPress={() => OpenModal(item)}>
                                            <View style={[styles.inputs, {backgroundColor: colors.secondBackgroundColor}]}>
                                                <Text numberOfLines={1} style={{color: '#959595'}}>{item.shortenLink}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {/*Copy button*/}
                                    <View style={styles.copy_button}>
                                        <TouchableOpacity useForeground={true} onPress={() => copyToClipboard(item.shortenLink)}>
                                            <View style={{height: 58, width: 58, justifyContent: 'center', alignItems: 'center'}}>
                                                <Icon name="content-copy" size={28} color="#D446C6"/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}/>

                    {/* Modal link */}
                    <Modal style={{height: height}} isVisible={linksModalVisible} onBackdropPress={() => setLinksModalVisible(false)}>
                        <View style={[styles.modal_style, {backgroundColor: colors.secondBackgroundColor}]}>
                            <View style={{flexDirection: "row", alignItems: 'center'}}>
                                {/*Close button*/}
                                <View style={styles.button}>
                                    <TouchableOpacity onPress={() => setLinksModalVisible(false)}>
                                        <View style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon onPress={() => setLinksModalVisible(false)} name="close" size={30} color="#D446C6"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginLeft: 'auto'}}>
                                    {/*Edit and Share buttons*/}
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon onPress={addFavorite} name={modalLinkItem.isFavorite ? "star" : "star-outline"} size={28} color="#D446C6"/>
                                        <Icon onPress={goEdit} style={{marginLeft: 10}} name="pencil-outline" size={28} color="#D446C6"/>
                                        <Icon onPress={onShare} style={{marginLeft: 10}} name="share-outline" size={28} color="#D446C6"/>
                                    </View>
                                </View>
                            </View>
                            {/*Link name*/}
                            <Text style={styles.modal_nameLink}>{modalLinkItem.name}</Text>
                            {/*Link creation date*/}
                            <View style={{height: 30, width: 160, padding: 10, alignItems: 'center', borderWidth: 1.5, 
                            borderColor: "#D446C6", borderRadius: 100, flexDirection: 'row', marginTop: 10, marginLeft: 8}}>
                                <Icon name="calendar-blank" size={19} color="#D446C6"/>
                                <View style={{height: 30, width: 1.5, backgroundColor: '#D446C6', marginLeft: 4, marginRight: 5}}></View>
                                <Text style={styles.modal_links}>{modalLinkItem.creationDate ? format(new Date(modalLinkItem.creationDate), "dd/MM/yyyy") : ""}</Text>
                            </View>
                            {/*Shortened Link*/}
                            <View style={{flexDirection: 'row', marginTop: 15, marginLeft: 10}}>
                                <Icon name="link" size={25} color="#D446C6"/>
                                <Text numberOfLines={1} onPress={() => copyToClipboard(modalLinkItem.shortenLink)} style={styles.modal_links}>{modalLinkItem.shortenLink}</Text>
                            </View>
                            {/*Normal Link*/}
                            <View style={{flexDirection: 'row', marginTop: 10, marginLeft: 10}}>
                                <Icon name="link-off" size={25} color="#858585"/>
                                <Text numberOfLines={1} onPress={() => copyToClipboard(modalLinkItem.link)} style={[styles.modal_links, {color: "#858585"}]}>{modalLinkItem.link}</Text>
                            </View>
                            {/*Delete button*/}
                            <View style={[styles.copy_button, {height: 30, width: 90, backgroundColor: "#D446C6", marginTop: 15, marginLeft: "auto"}]}>
                                <TouchableOpacity onPress={() => deleteLink()}>
                                    <View style={{height: 30, width: 90, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text onPress={() => deleteLink()} style={{color: "white", fontFamily: "Archivo_700Bold", fontSize: 16}}>Excluir</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/*Modal filter */}
                    <Modal style={{height: height}} isVisible={filterModalVisible} 
                    onBackdropPress={() => setFilterModalVisible(false)}>
                        <View style={[styles.modal_style, {backgroundColor: colors.secondBackgroundColor}]}>
                            {/*Close button*/}
                            <View style={styles.button}>
                                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                    <View style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon onPress={() => setFilterModalVisible(false)} name="close" size={30} color="#D446C6"/>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/*Alphabetical Order*/}
                            <View style={styles.filter_options}>
                                <Text style={[styles.text_style, {fontSize: 20}]}>Ordem alfabética</Text>
                                <View style={[styles.button, {right: 40}, 
                                isAlphabeticalOrder ? {backgroundColor: "#D446C6"} : {backgroundColor: colors.secondBackgroundColor}]}>
                                    <TouchableOpacity 
                                    onPress={() => {clearFilter(); setIsAlphabeticalOrder(!isAlphabeticalOrder)}}>
                                        <View style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon name="order-alphabetical-ascending" size={25} 
                                            color={isAlphabeticalOrder ? "white" : "#D446C6"}
                                            onPress={() => {clearFilter(); setIsAlphabeticalOrder(!isAlphabeticalOrder)}}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/*Date Order(new -> old)*/}
                            <View style={styles.filter_options}>
                                <Text style={[styles.text_style, {fontSize: 20}]}>Mais recente</Text>
                                <View style={[styles.button, {right: 40}, 
                                isNewest ? {backgroundColor: "#D446C6"} : {backgroundColor: colors.secondBackgroundColor}]}>
                                    <TouchableOpacity
                                    onPress={() => {clearFilter(); setIsNewest(!isNewest)}}>
                                        <View style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon name="calendar-import" size={25} 
                                            color={isNewest ? "white" : "#D446C6"}
                                            onPress={() => {clearFilter(); setIsNewest(!isNewest)}}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/*Date Order(old -> new)*/}
                            <View style={styles.filter_options}>
                                <Text style={[styles.text_style, {fontSize: 20}]}>Mais antigo</Text>
                                <View style={[styles.button, {right: 40}, 
                                isOlder ? {backgroundColor: "#D446C6"} : {backgroundColor: colors.secondBackgroundColor}]}>
                                    <TouchableOpacity onPress={() => {clearFilter(); setIsOlder(!isOlder)}}>
                                        <View style={{height: 50, width: 50, justifyContent: 'center', alignItems: 'center'}}>
                                            <Icon name="calendar-export" size={25}
                                            color={isOlder ? "white" : "#D446C6"}
                                            onPress={() => {clearFilter(); setIsOlder(!isOlder)}}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/*Show only favorite links*/}
                            <View style={styles.filter_options}>
                                <Text style={[styles.text_style, {fontSize: 20}]}>Somente favoritos</Text>
                                <View style={{right: 40}}>
                                    <ToggleSwitch
                                        isOn={onlyFavorite}
                                        onColor="#D446C6"
                                        offColor="gray"
                                        size="small"
                                        onToggle={() => setOnlyFavorite(!onlyFavorite)}
                                    />
                                </View>
                            </View>

                            {/*Ok button*/}
                            <View style={[styles.copy_button, {height: 30, width: 90, backgroundColor: "#D446C6", marginTop: 30, marginLeft: "auto"}]}>
                                <TouchableOpacity onPress={() => closeFilterModal()} useForeground={true}>
                                    <View style={{height: 30, width: 90, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text onPress={() => closeFilterModal()} style={{color: "white", fontFamily: "Archivo_700Bold", fontSize: 16}}>Ok</Text>
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
      height: height
    },
    filter:{
        height: 50,
        width: 50,
        borderWidth: 2,
        borderColor: "#D446C6",
        borderRadius: 10,
        marginLeft: 25,
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
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
    inputs:{
        height: 60,
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
        height: 60,
        width: 60,
        backgroundColor: '#E0B1DB',
        borderRadius: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    modal_style:{
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
        width: "90%"
    },
    filter_options: {
        marginTop: 20,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center'
    }
});