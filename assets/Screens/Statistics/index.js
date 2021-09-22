import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useTheme } from '@react-navigation/native';
import { List, ActivityIndicator } from 'react-native-paper';
import { BarChart } from "react-native-chart-kit";
import { eachDayOfInterval, eachMonthOfInterval, subDays, format, subMonths } from 'date-fns';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Statistics() {
    const IsFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const { colors } = useTheme();

    const [expanded, setExpanded] = useState(false);
    const [filterState, setFilterState] = useState({text: 'Última semana', icon: 'calendar-week'});
    const [links, setLinks] = useState([]);
    const [totalLinks, setTotalLinks] = useState(0);

    const [data, setData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
        datasets: [
          {
            data: [20, 45, 28, 80, 85, 43]
          }
        ]
    });

    const chartConfig = {
        backgroundGradientFrom: colors.secondBackgroundColor,
        backgroundGradientTo: colors.secondBackgroundColor,
        color: (opacity = 1) => `rgba(212, 70, 198, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.35,
        useShadowColorFromDataset: false,
    };

    useEffect(() => {
        if(IsFocused)
            loadData();
    }, [IsFocused])

    async function loadData()
    {
        const allLinks = JSON.parse(await AsyncStorage.getItem("Data"));
        setLinks(allLinks); //keep links

        //Set total links number
        setTotalLinks(allLinks.length);

        filter(filterState.text, allLinks);
    }

    function filter(option, allLinks)
    {
        let labels = [];
        let linksInPeriod = [];

        //Filter links from last week
        if(option == 'Última semana')
        {
            let days = eachDayOfInterval({start: subDays(Date.now(), 7), end: Date.now()});
            
            days.forEach(function(date){
                labels.push(format(date, 'EEEEEE', {locale: require('date-fns/locale/pt-BR')}));
                
                let numCorrespondents = 0;
                for(var i = 0; i < allLinks.length; i++)
                {
                    if(new Date(date).toDateString() == new Date(allLinks[i].creationDate).toDateString())
                        numCorrespondents++;
                }

                linksInPeriod.push(numCorrespondents);
            })
        }

        //Filter links from the last ten days
        if(option == 'Últimos 10 dias')
        {
            let days = eachDayOfInterval({start: subDays(Date.now(), 9), end: Date.now()});
            
            days.forEach(function(date){
                labels.push(format(date, 'dd', {locale: require('date-fns/locale/pt-BR')}));
                
                let numCorrespondents = 0;
                for(var i = 0; i < allLinks.length; i++)
                {
                    if(new Date(date).toDateString() == new Date(allLinks[i].creationDate).toDateString())
                        numCorrespondents++;
                }

                linksInPeriod.push(numCorrespondents);
            })
        }

        //Filter links from the last eight months
        if(option == 'Últimos 8 messes'){
            let months = eachMonthOfInterval({start: subMonths(Date.now(), 7), end: Date.now()});

            months.forEach(function(date){
                labels.push(format(date, 'LLL', {locale: require('date-fns/locale/pt-BR')}));

                let numCorrespondents = 0;
                for(var i = 0; i < allLinks.length; i++)
                {
                    if(new Date(date).getMonth() == new Date(allLinks[i].creationDate).getMonth())
                        numCorrespondents++;
                }

                linksInPeriod.push(numCorrespondents);
            })
        }

        let data = {
            labels: labels,
            datasets: [
                {
                  data: linksInPeriod
                }
            ]
        }

        setData(data);
        setIsLoading(false);
    }

    if(isLoading)
    {
      return (
        <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
            <ActivityIndicator size='large' style={{marginTop: (height-120)/2}} animating={true} color='#D446C6'/>
        </View>
      )
    }
    return(
        <View style={[styles.container, {backgroundColor: colors.backgroundColor}]}>
            <StatusBar barStyle={colors.statusBar} translucent backgroundColor="transparent"/>
            
            <View style={[styles.header, {backgroundColor: colors.header}]}>
                <Text style={styles.screenTitle}>Estatísticas</Text>
                <Image style={{width: 165, height: 100, marginTop: 'auto', marginLeft: 'auto'}} source={require('../../img/Statistics.png')}/>
            </View>
            
            <ScrollView>
                <View style={{width: width, justifyContent: 'center', alignItems: 'center'}}>
                    {/*Total shortened links*/}
                    <View style={styles.totalLinks}>
                        <Text style={styles.totalLinks_text}>Links encurtados</Text>
                        <Text style={[styles.totalLinks_number, {fontSize: 50}]}>{totalLinks}</Text>
                    </View>

                    <List.Section style={{marginTop: 20, backgroundColor: 'white'}}>
                        <List.Accordion
                        style={{width: (width/100) * 80, height: 60, justifyContent: 'center', backgroundColor: colors.secondBackgroundColor}}
                        title={filterState.text}
                        titleStyle={{color: '#D446C6'}}
                        left={props => <List.Icon {...props} icon={filterState.icon} color="#D446C6" />}
                        expanded={expanded}
                        onPress={() => setExpanded(!expanded)}>
                            <List.Item title="Última semana" onPress={() => {setFilterState({text: "Última semana", icon: 'calendar-week'}); 
                            setExpanded(false); filter("Última semana", links)}} style={{backgroundColor: colors.thirdBackgroundColor}}/>
                            <List.Item title="Últimos 10 dias" onPress={() => {setFilterState({text: "Últimos 10 dias", icon: 'calendar-text'}); 
                            setExpanded(false); filter("Últimos 10 dias", links)}} style={{backgroundColor: colors.thirdBackgroundColor}}/>
                            <List.Item title="Últimos 8 messes" onPress={() => {setFilterState({text: "Últimos 8 messes", icon: 'calendar-blank-multiple'}); 
                            setExpanded(false); filter("Últimos 8 messes", links)}} style={{backgroundColor: colors.thirdBackgroundColor}}/>
                        </List.Accordion>
                    </List.Section>

                    <BarChart
                      style={{borderRadius: 5, justifyContent: 'center', marginBottom: 20, marginTop: 20}}
                      data={data}
                      width={(width/100) * 80}
                      height={270}
                      chartConfig={chartConfig}
                      verticalLabelRotation={20}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        height: (height/100) * 20,
        width: width,
        position: 'absolute',
        top: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        paddingBottom: 20,
        paddingHorizontal: 40,
        flexDirection: 'row',
        zIndex: 10
    },
    screenTitle: {
        fontFamily: 'Archivo_700Bold',
        marginTop: 'auto',
        fontSize: 30,
        color: '#D446C6'
    },
    totalLinks: {
        height: (height/100) * 22,
        width: (height/100) * 22,
        borderWidth: 20,
        borderRadius: 100,
        borderColor: "#D446C6",
        marginTop: (height/100) * 23,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5
    },
    totalLinks_text: {
        fontFamily: 'Archivo_700Bold',
        fontSize: 12,
        color: '#D446C6',
        width: (height/100) * 12,
        textAlign: 'center',
        top: 10
    },
    totalLinks_number: {
        fontFamily: 'Archivo_700Bold',
        color: '#E0B1DB',
        bottom: 5
    }
})