import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity, Alert, Dimensions, ScrollView, TextInput, Platform, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
//import * as Haptics from 'expo-haptics';
//https://docs.expo.dev/versions/latest/sdk/haptics/

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('screen').height;
let screenWidth = Dimensions.get('screen').width;
let cookieHeight = deviceHeight/3;

export default class App extends Component {
    state = {
        screens: ['block', 'none', 'none', 'none', 'none'], 
        gambleScreens: ['block', 'none', 'none', 'none'], 
        stockScreens: ['block', 'none'],
        saveScreens:['block', 'none', 'none'],
        diceGambleNum: 1, 
        maxDiceNum: 0, 
        numRolled: 0, 
        betAmount: "", 
        cookiesWonInGamble: "Won: ?",
        cookies: 0.00,
        cookieS: '',
        cookieRot: 0,
        clickPower: 1,
        clickPrice: 500,
        cps: 0.00, 
        encodedCode: "",
        gambleImages: {
            'https://codehs.com/uploads/e9ab66d0a796ea164363e7e3830e7239': 2,
            'https://codehs.com/uploads/f2b51d987924500632b6d17b52fea0ee': 4,
            'https://codehs.com/uploads/3a347f2d33efd9d497f601c800f0c83e': 6,
            'https://codehs.com/uploads/5fd52273379e5f598a79ed9ffb4acdc5': 8,
            'https://codehs.com/uploads/7627dcfd38370770b273d947e4c6bf2d': 10,
            'https://codehs.com/uploads/c596cad96509fb446fd417a6e2179091': 12,
            'https://codehs.com/uploads/4ea8cafa629229f5a97886925924033e': 20,
            'https://codehs.com/uploads/3cb71656381b30606f50f37ec63ead60': 100,
        },
        tabs: [
            'towers',
            'upgrades',
            'gambling',
            'stocks',
            'save',
        ],

        buildings: {
            'Pointers': [15, 0, 0.1, 15],
            'Grandmas': [100, 0, 1.0, 100],
            'Farms': [1100, 0, 8.0, 1100],
            'Mines': [12000, 0, 47.0, 12000],
            'Factory': [130000, 0, 260.0, 130000],
            'Bank': [1400000, 0, 1400, 1400000],
            'Temple': [20000000, 0, 7800, 20000000],
            'Wizard Tower': [330000000, 0, 44000, 330000000]
        },
        multi: {
            'Pointers': [15*7.5, 1.00],
            'Grandmas': [100*7.5, 1.00],
            'Farms': [1100*7.5, 1.00],
            'Mines': [12000*7.5, 1.00],
            'Factory': [130000*7.5, 1.00],
            'Bank': [1400000*7.5, 1.00],
            'Temple': [20000000*7.5, 1.00],
            'Wizard Tower': [330000000*7.5, 1.00]
        },
        //STOCK INDEX KEY: 0: COST, 1: RESTING AMOUNT,  2: AMOUNT BOUGHT, 3: LIMIT TO BUY AMOUNT, 4: STOCK STATE, 5: STOCK STATE DURATION, 6: DELTA / SLOPE, 7: Y CORDS.
        // STOCK STATE KEY: 0: STABLE, 1: SLOW CLIMB, 2: SLOW FALL, 3: FAST CLIMB, 4: FAST FALL, 5: CHAOTIC
        stocks: {
            'Sugar':      [10.0, 10.0, 0, 1, 0, NaN, NaN, deviceHeight/deviceHeight, 'https://codehs.com/uploads/b5ae9ca1b5429a1a4dbd1451a4e6ca5d'],
            'Dough':      [20.0, 20.0, 0, 1, 0, NaN, NaN, deviceHeight/deviceHeight, 'https://codehs.com/uploads/ef797b689c2445269007ea4e514fc6b4'],
            'Chocolate':  [30.0, 30.0, 0, 1, 0, NaN, NaN, deviceHeight/deviceHeight, 'https://codehs.com/uploads/e65da26cd08c29d6270310f012274914'],
            'Flour':      [40.0, 40.0, 0, 1, 0, NaN, NaN, deviceHeight/deviceHeight, 'https://codehs.com/uploads/e325047a58d8e539f095a52a8b50ef06'],
            'CocoPowder': [50.0, 50.0, 0, 1, 0, NaN, NaN, deviceHeight/deviceHeight, 'https://codehs.com/uploads/53ea62786a7ac75c0664d01d6727f741'],
          },
        save: '',
        saveString: '',
        savePh: 'Paste your save code here',
    }
    
    changeScreen = (index, screens, name) => {
        for (let i =0; i < screens.length; i++){
            if(screens[i] == 'block'){
                screens[i]= 'none';
            }
        }
        screens[index] = 'block';
        this.setState({screens: screens})
        if(name == "gambling")
        {
            this.setState({
                gambleScreens: ["block", "none", "none", "none"],
                diceGambleNum: 1,
                maxDiceNum: 0,
                numRolled: 0,
                betAmount: "",
                cookiesWonInGamble: "Won: ?",
            });
        };
        if(name == 'stocks')
        {
            this.setState({
                stockScreens: ['none', 'block'],
            })
        }
        else{
            this.setState({
                stockScreens: ['block', 'none'],
            })
        };
        if(name == 'save')
        {
            this.setState({
                saveScreens: ['block', 'none', 'none'],
            })
        };  
    }; 
    
    addAllCookies = setInterval(() => {
        var total = 0;
        var names = Object.keys(this.state.buildings);
        for(let i = 0; i < Object.values(this.state.buildings).length; i++) {
            total = total + ( (this.state.buildings[names[i]][1]*this.state.buildings[names[i]][2]) * this.state.multi[names[i]][1])
        }
        this.setState({ cookies: this.state.cookies + total, cps: total});
    }, 1000 );
    
    cookieRotation = setInterval(() => {
        this.setState({
            cookieRot: this.state.cookieRot+.25,
        });
    },50); 
    increaseCost = (building, amt) => {
        if(this.state.cookies >= building[0]){
            var minus = building[0];
            building[1] = Math.floor(amt+1);
            building[0] = Math.ceil(building[3]*(Math.pow(1.15, building[1])));
            this.setState({ 
                cookies: this.state.cookies-minus,
            });
        };
    };
    increaseMulti = (building, amt) => {
        if(this.state.cookies >= building[0]){
            var minus = building[0];
            building[1] = amt*1.05;
            building[0] = Math.floor(minus*1.3);
            this.setState({ 
                cookies: this.state.cookies-minus,
            });
        };
    };
    increaseClick = () => {
        if(this.state.cookies >= this.state.clickPrice){
            var minus = this.state.clickPrice;
            this.setState({
               cookies: this.state.cookies-minus,
               clickPower: this.state.clickPower*2,
               clickPrice: (this.state.clickPrice*2.45).toFixed(0),
            });
        };
    };
    buyStock = (name) => {
        if(this.state.cookies >= this.state.stocks[name][0] &&  this.state.stocks[name][2] < this.state.stocks[name][3]){
            this.state.stocks[name][2] = this.state.stocks[name][2] + 1;
            this.setState({
                cookies: this.state.cookies - this.state.stocks[name][0],
            })
        }
    }
    sellStock = (name) => {
        if(this.state.stocks[name][2] > 0){
            this.state.stocks[name][2] = this.state.stocks[name][2] - 1;
            this.setState({
                cookies: this.state.cookies + this.state.stocks[name][0],
            })
        }
    }

    
    plusPressed = () => { 
        if(this.state.diceGambleNum < this.state.maxDiceNum) this.setState({diceGambleNum: this.state.diceGambleNum + 1})
    };
    bigPlusPressed = () => { 
        if(this.state.diceGambleNum + 10 < this.state.maxDiceNum) this.setState({diceGambleNum: this.state.diceGambleNum + 10})
        else(this.setState({diceGambleNum: this.state.maxDiceNum}))
    };
    minusPressed = () => { 
        if(this.state.diceGambleNum > 1) this.setState({diceGambleNum: this.state.diceGambleNum - 1})
    };
    bigMinusPressed = () => { 
        if(this.state.diceGambleNum - 10 > 1) this.setState({diceGambleNum: this.state.diceGambleNum - 10})
        else(this.setState({diceGambleNum: 1}))
    };
    
    rollDice = () => {
       this.setState({
            numRolled: Math.floor((Math.random() * this.state.maxDiceNum) + 1)
        }); 
    };
    rollDiceMultipleTimes = async () => {
        this.setState({gambleScreens: ["none", "none", "none", "block"]});
        if(parseInt(this.state.betAmount) > this.state.cookies) this.setState({betAmount: this.state.cookies});
        if(parseInt(this.state.betAmount) < 0) this.setState({betAmount: 0});
        this.setState({
            numRolled: Math.floor((Math.random() * this.state.maxDiceNum) + 1)
        });
        for(let i = 0; i < 5; i++){
            this.rollDice();
            await new Promise(resolve => setTimeout(resolve, 75));
        }
        this.diceRoll();
    };
    diceRoll = () => {
        var realNumberRolled = Math.floor((Math.random() * this.state.maxDiceNum) + 1);
            this.setState({
                numRolled: realNumberRolled
            })
            if(this.state.diceGambleNum == realNumberRolled) {
                if(this.state.maxDiceNum < 10)
                    this.setState({cookies: this.state.cookies + ( parseInt(this.state.betAmount) * (this.state.maxDiceNum * 0.75) ), cookiesWonInGamble: "Won: " + ( parseInt(this.state.betAmount) * (this.state.maxDiceNum * 0.75) )})
                if(this.state.maxDiceNum > 10)
                    this.setState({cookies: this.state.cookies + ( parseInt(this.state.betAmount) * (this.state.maxDiceNum * 1.75) ), cookiesWonInGamble: "Won: " + ( parseInt(this.state.betAmount) * (this.state.maxDiceNum * 1.75) )})
            }
            else {
            this.setState({cookies: this.state.cookies - parseInt(this.state.betAmount), cookiesWonInGamble: "Lost: " + parseInt(this.state.betAmount)})
            }
    }
    
    load = (code) => {
        const base64Regex = /^[a-zA-Z0-9+/]*={0,2}$/;

        let decodedCode;
        try {
            decodedCode = atob(code);
        } catch (error) {
            alert("Invalid code:", error);
            this.setState({ save: '',});
            return;
        }
        const [cookies, buildingsCode, multipliersCode, clickPower, clickPrice] = decodedCode.split("/");
    
        const names = Object.keys(this.state.buildings);
    
        const buildings = {};
        const multi = {};
        names.forEach((name, index) => {
            buildings[name] = buildingsCode.split("|")[index].split(",").map(Number);
            multi[name] = multipliersCode.split("|")[index].split(",").map(Number);
        });
    
        this.setState({
            cookies: Number(cookies),
            buildings: names.reduce((acc, name, index) => {
                acc[name] = buildings[name];
                return acc;
            }, {}),
            multi: names.reduce((acc, name, index) => {
                acc[name] = multi[name];
                return acc;
            }, {}),
            clickPower: Number(clickPower),
            clickPrice: Number(clickPrice),
            save: '',
        });
    }
    encode = () => {
        const { buildings, multi, cookies, clickPower, clickPrice } = this.state;
        const names = Object.keys(buildings);
    
        const buildVars = names.map(name => Object.values(buildings[name]).join(','));
        const buildingsCode = buildVars.join('|') + '/';
    
        const multiVars = names.map(name => Object.values(multi[name]).join(','));
        const multipliersCode = multiVars.join('|') + '/';
    
        const encoded = btoa(cookies + '/' + buildingsCode + multipliersCode + clickPower + '/' + clickPrice);
        
        this.setState({ encodedCode: encoded });
    }
    
    checkNaN = (value) => {
        if(value.toString().length <= 0 || value == 0){
            alert('NaN');
            return true;
        }
        else {
            return false;
        }
    }
    generateValueNaN = () => {
        
    }
    
    moveStock = setInterval(() => {
        const { stocks, buildings } = this.state;
        const stockNames = Object.keys(stocks);
        const buildingNames = Object.keys(buildings);
        
        const screenBottom = (Number)(deviceHeight/2);
        const screenTop = (Number)(deviceHeight/deviceHeight);
        const range = (Number)(screenBottom - screenTop);
        var marketCap = (Number)(100 + (3 * (buildings[buildingNames[5]][1] - 1)));
        for(let i=0; i<stockNames.length; i++){
            const percent = stocks[stockNames[i]][0] / marketCap;
            const position = screenBottom * percent;
            stocks[stockNames[i]][7] = screenBottom - position;
        }
        
    }, 500);
    stockChanges = setInterval(() => {
        const { stocks, buildings } = this.state;
        const stockNames = Object.keys(stocks);
        const buildingNames = Object.keys(buildings);
        var restingValue = 0;
        
        for(let i=0; i<stockNames.length; i++){
            stocks[stockNames[i]][3] = Math.floor(buildings[buildingNames[i]][1] * buildings[buildingNames[i]][2]);

            restingValue = 10 * (i+1) + (Number)(buildings[buildingNames[5]][1]) - 1;
            stocks[stockNames[i]][1] = restingValue;
            
            var value = (Number)(stocks[stockNames[i]][0]);
            value += (restingValue - value) * 0.01;
            value += (this.generateRandomNumber(-3, 3));

            var delta = (Number)(stocks[stockNames[i]][6]);
            if(isNaN(delta)){
                delta = this.generateRandomNumber(-0.05, 0.05);
                if(delta == 0) delta += -0.01;
            }
            delta += (delta * 0.03);

            if(Math.floor(this.generateRandomNumber(1, 100)) <= 10){
                delta += this.generateRandomNumber(-0.15, 0.15);
                value += delta;
            } 
            if(Math.floor(this.generateRandomNumber(1, 100)) <= 15) value += this.generateRandomNumber(-1.5, 1.5);
            if(Math.floor(this.generateRandomNumber(1, 100)) <= 3) value += this.generateRandomNumber(-5, 5);

            var state = (Number)(stocks[stockNames[i]][4]);
            if(isNaN(state)){
                state = Math.floor(this.generateRandomNumber(0, 5));
            } 
            
            var stateDuration = (Number)(stocks[stockNames[i]][5]);
            if(isNaN(stateDuration)){
                stateDuration = Math.floor(this.generateRandomNumber(5, 15));
            } 
            stateDuration -= 1;
            
            if(stateDuration === NaN || stateDuration <= 0 || Math.floor(this.generateRandomNumber(1, 100)) <= 10){
                var changeState = this.generateRandomNumber(1, 100);

                if(state == 3 || state == 4){
                    if(Math.floor(this.generateRandomNumber(1, 100)) <= 70)
                        state = 5
                }

                if(changeState <= 12.5) state = 0;
                else if(changeState > 12.5 && changeState <= 37.5) state = 1;
                else if(changeState > 37.5 && changeState <= 62.5) state = 2;
                else if(changeState > 62.5 && changeState <= 75){
                    state = 3;
                } 
                else if(changeState > 75 && changeState <= 87.5){
                    state = 4;
                }
                else if(changeState > 87.5) state = 5;

                stateDuration = Math.floor(this.generateRandomNumber(5, 15));
            }

            if(state == 0){
                delta -= (delta * 0.05);
                delta += this.generateRandomNumber(-0.02, 0.02);
            }
            else if(state == 1){
                delta -= (delta * 0.01);
                delta += this.generateRandomNumber(-0.04, 0.05);
            }
            else if(state == 2){
                delta -= (delta * 0.01);
                delta += this.generateRandomNumber(-0.04, 0.01);
            }
            else if(state == 3){
                value += this.generateRandomNumber(0, 5);
                delta += this.generateRandomNumber(-0.01, 0.14);
                if(this.generateRandomNumber(1, 100) <= 30){
                    value += this.generateRandomNumber(-3, 7);
                    delta += this.generateRandomNumber(-0.05, 0.05);
                }
                if(this.generateRandomNumber(1, 100) <= 3) state = 4;
            }
            else if(state == 4){
                value += this.generateRandomNumber(-5, 0);
                delta += this.generateRandomNumber(-0.14, 0.1);
                if(this.generateRandomNumber(1, 100) <= 30){
                    value += this.generateRandomNumber(-3, 7);
                    delta += this.generateRandomNumber(-0.05, 0.05);
                }
            }
            else if(state == 5){
                delta += this.generateRandomNumber(-0.15, 0.15);
                if(this.generateRandomNumber(1, 100) <= 50){
                    value += this.generateRandomNumber(-5, 5);
                }
                if(this.generateRandomNumber(1, 100) <= 20){
                    delta = this.generateRandomNumber(-1, 1);
                }
            }
            var marketCap = (Number)(100 + (3 * (buildings[buildingNames[5]][1] - 1)));
            if( value > marketCap){
                value = marketCap;
            }
            else if(value < 1){
                value = 1;
            }
            
            stocks[stockNames[i]][0] = (Number)(value.toFixed(2));
            stocks[stockNames[i]][4] = (Number)(state.toFixed(2));
            stocks[stockNames[i]][5] = (Number)(stateDuration.toFixed(2));
            stocks[stockNames[i]][6] = (Number)(delta.toFixed(2));
        }
        
    }, 5000);
    
    generateRandomNumber = (min, max) => {
        var rValue = (Number)((min + Math.random()*(max - min)).toFixed(2));
        return rValue;
    }
    

    render() {
        if(Platform.OS === 'web') {
            return (
                <View style={styles.container}>
                    <View style={{ display: this.state.stockScreens[0]}}>
                        <View style={styles.cookieC}> 
                                <Text style={styles.cpsText}> 
                                    {this.state.cookies.toFixed(1) + " Cookies"} 
                                </Text>
                                
                                <TouchableOpacity style={{ borderRadius: (screenHeight/5.5), background: 'grey' }}
                                    onPress={() => {
                                        this.setState({cookies: this.state.cookies+this.state.clickPower})
                                    }}
                                    activeOpacity={.8}
                                >
                                
                                    <View style={{transform: [{rotate: this.state.cookieRot + 'deg'}], }}>
                                    
                                        <Image
                                            source={{ uri: 'https://codehs.com/uploads/6529cb528ca6905cfd4fd79a5f5bce9a' }}
                                            style={{ height: screenWidth/5.5, width: screenWidth/5.5, alignSelf: 'center' }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                <Text style={styles.cookieText}> {this.state.cps.toFixed(1)} {' '} per/sec </Text>
                        </View>
                    </View>
                    
                    <View style={{ display: this.state.stockScreens[1]}}>
                        <ImageBackground style={styles.stockC}
                            source={{ uri: 'https://codehs.com/uploads/c9ec4f8478d93ecb8113550642d1f8c7' }}
                            
                        >
                        {Object.entries(this.state.stocks).map(([k,v]) => (
                            <Image
                                source={{ uri: v[8] }}
                                style={{
                                    width: screenWidth/30,
                                    height: screenWidth/30,
                                    position: 'absolute',
                                    transform: [{ translateY: v[7] }]
                                }}>
                            </Image>
                        ))}
                        </ImageBackground>
                    </View>
                    
                    <ScrollView horizontal={true} style={styles.tabsC}>
                        {this.state.tabs.map((name) => (
                            <TouchableOpacity style={styles.tabs}
                                onPress={() => {
                                    this.changeScreen(this.state.tabs.indexOf(name), this.state.screens, name, );
                                }}
                            >   
                                <Text> {name} </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
    
                   <View style={{height: cookieHeight}}>
                        <View style={{ display: this.state.screens[0] }}>
                        {
                            <ScrollView style={styles.upgradeC}>
                                {Object.entries(this.state.buildings).map(([k,v]) => (
                                    <View style={styles.buildingBar}>
                                        <Text style={styles.towerText}>
                                            {k} - {' ' + v[1].toString()}
                                        </Text>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.increaseCost(this.state.buildings[k], this.state.buildings[k][1],);
                                            }}
                                        >
                                            <Text> {v[0]} </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                        </ScrollView>
                        }
                        </View>
                        
                        <View style={{ display: this.state.screens[1] }}>
                        {
                            <ScrollView style={styles.upgradeC}>
                                <View style={styles.buildingBar}>
                                    <Text style={styles.towerText}>Click Power - {this.state.clickPower} </Text>
                                    <TouchableOpacity style={styles.buyButton}
                                        onPress={() => {
                                        this.increaseClick();
                                        }}
                                    >
                                        <Text> {this.state.clickPrice} </Text>
                                    </TouchableOpacity>
                                </View>
                                {Object.entries(this.state.buildings).map(([k,v]) => (
                                    <View style={styles.buildingBar}>
                                        <Text style={styles.towerText}>
                                            {k} - x{this.state.multi[k][1].toFixed(2)}
                                        </Text>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.increaseMulti(this.state.multi[k], this.state.multi[k][1],);
                                        }}>
                                            <Text> {this.state.multi[k][0]} </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        }
                        </View>
                        
                        <View style = {{display: this.state.screens[2] }}> 
                        { 
                            <View style = {styles.upgradeC}>
                                <View style={{background: 'green', height: cookieHeight}}>    
                                    
                                    <View style = {{display: this.state.gambleScreens[0] }}>
                                        <View style={{justifyContent: 'space-evenly', alignItems: "center", height: cookieHeight}}>
                                            <View style={styles.gambleInput}>
                                                <TextInput
                                                    placeholder={'Enter bet amount here'}
                                                    onChangeText={(betAmount) => this.setState({betAmount})}
                                                    value={this.state.betAmount}
                                                    keyboardType='numeric'
                                                />
                                            </View>
                                        
                                            <TouchableHighlight style={styles.enterButton}
                                                    onPress={() => {
                                                        if(!this.checkNaN(this.state.betAmount)){
                                                            this.setState({gambleScreens: ["none", "block", "none", "none"],})
                                                        }
                                                    }}
                                                >
                                                <Text style={styles.gambleText}> Continue </Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    
                                    {
                                    <View style = {{display: this.state.gambleScreens[1] }}>
                                            <Text style = {styles.gambleText}> Select Dice </Text> 
                                            <View style={styles.rowContainer}>
                                            {Object.entries(this.state.gambleImages).map(([k,v]) => (
                                                    <View style = {styles.imageContainer}>
                                                        <TouchableHighlight
                                                            underlayColor={'clear'}
                                                            onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: v}) }}
                                                        >
                                                            <Image
                                                            source={{ uri: k }}
                                                            style={{ height: deviceHeight/5, width: deviceWidth / 10, resizeMode: 'contain'}}
                                                            />
                                                        </TouchableHighlight>
                                                    </View>
                                            ))}
                                                
                                                
                                            </View> 
                                    </View>
                                    } 
    
                                    {
                                    <View style = {{display: this.state.gambleScreens[2] }}>
                                    <View style={{ alignItems: "center",height: cookieHeight}}>
                                            <Text style = {styles.smallGambleText}> Select Number To Bet On </Text>
                                            <View style={styles.rowContainer}>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => {this.bigMinusPressed(); }}
                                                    >
                                                    <Text style={styles.biggerText}>-</Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => { this.minusPressed(); }}
                                                    >
                                                    <Text style={styles.bigText}>-</Text>
                                                </TouchableHighlight>
                                                <Text style = {styles.bigText}> {this.state.diceGambleNum} </Text>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => { this.plusPressed(); }}
                                                    >
                                                    <Text style={styles.bigText}>+</Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => { this.bigPlusPressed(); }}
                                                    >
                                                    <Text style={styles.biggerText}>+</Text>
                                                </TouchableHighlight>
                                            </View>
                                            <TouchableHighlight style={styles.enterButton}
                                                    onPress={() => { 
                                                        this.rollDiceMultipleTimes();
                                                    }}
                                                >
                                                <Text style={styles.gambleText}> Continue </Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    } 
                                    {
                                        <View style = {{display: this.state.gambleScreens[3] }}>
                                            <View style={{ alignItems: "center", height: cookieHeight}}>
                                                <Text style={{fontSize: deviceHeight/20, color: "white"}}> Cookies Bet: {this.state.betAmount} </Text>
                                                <Text style={styles.bigText}> {this.state.numRolled} </Text>
                                                <Text style={{fontSize: deviceHeight/20, color: "white"}}> Cookies {this.state.cookiesWonInGamble} </Text>
                                                <TouchableHighlight style={styles.enterButton}
                                                    onPress={() => {
                                                        this.setState({gambleScreens: ['block', 'none', 'none', 'none'], betAmount: '', cookiesWonInGamble: 'Won ?', diceGambleNum: 1,})
                                                    }}
                                                    >
                                                    <Text style={styles.gambleText}> Play Again </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    } 
                                </View>
                            </View>
                        }
                        </View>
                        
                        
                        <View style={{ display: this.state.screens[3]}}>
                        {
                            <ScrollView style={styles.upgradeC}>
                                {Object.entries(this.state.stocks).map(([k,v]) => (
                                    <View style={styles.buildingBar}>
                                        <Text style={styles.towerText}>
                                            {k}  {v[2].toString() + '/' + v[3].toString()}
                                        </Text>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.sellStock(k.toString());
                                            }}
                                        >
                                            <Text> Sell </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.buyStock(k.toString());
                                            }}
                                        >
                                            <Text> {v[0]} </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        }
                        </View>
                        
                        <View style={{ display: this.state.screens[4]}}>
                        {
                            <View style={{display: this.state.saveScreens[0]}}>
                                <View style={styles.upgradeC}>
                                    <View style={{background: 'green', height: cookieHeight, width: deviceWidth, flex: 1,justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}}>
                                        <TouchableOpacity style={styles.saveButton}
                                            onPress={() => {
                                                if (Platform.OS === 'web'){
                                                    this.encode();
                                                    this.setState({saveScreens: ['none', 'block', 'none'],})
                                                }
                                                else 
                                                    alert('no save for phone');
                                        }}>
                                            <Text style={{fontSize: 20}}> Save </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.saveButton}
                                            onPress={() => {
                                                if (Platform.OS === 'web')
                                                    this.setState({saveScreens: ['none', 'none', 'block'],})
                                                else 
                                                    alert('no save for phone');    
                                        }}>
                                            <Text style={{fontSize: 20}}> Load </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            }
                        
                            {/* Save Screen ends here*/}
                            <View style={{display: this.state.saveScreens[1]}}>
                            {
                                <View style={styles.upgradeC}>
                                    <View style={{background: 'green', flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.gambleText} selectable={false}> Your code is </Text>
                                        <ScrollView style={{width: deviceWidth/1.2, alignSelf: 'center'}}>
                                            <Text style={{fontSize: deviceHeight/50, color: 'white'}}> {this.state.encodedCode} </Text>
                                        </ScrollView>
                                    </View>
                                </View>
                            }
                            </View>
                            
                            <View style={{display: this.state.saveScreens[2]}}>
                            {
                                <View style={styles.upgradeC}>
                                    <View style={{background: 'green', flex: 1, justifyContent: 'space-evenly'}}>
                                        <View style={{width: deviceWidth/1.2, paddingHorizontal: deviceWidth/14.9, paddingVertical: deviceHeight/26.6, alignSelf: 'center', background: 'white', borderRadius: deviceWidth/59.6}}>
                                        <TextInput 
                                            placeholder={this.state.savePh}
                                            onChangeText={(save) => this.setState({save})}
                                            value={this.state.save}
                                        />
                                        </View>
                                        <TouchableOpacity style={styles.saveButton}
                                            onPress={() => {
                                            this.load(this.state.save);
                                            this.changeScreen(0,this.state.screens);
                                        }}>
                                            <Text> Load </Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            }
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.container}>
                    <View style={{ display: this.state.stockScreens[0]}}>
                        <View style={styles.cookieC}> 
                                <Text style={styles.cpsText}> 
                                    {this.state.cookies.toFixed(1) + " Cookies"} 
                                </Text>
                                
                                <TouchableOpacity style={{ borderRadius: (screenHeight/5.5), background: 'grey' }}
                                    onPress={() => {
                                        this.setState({cookies: this.state.cookies+this.state.clickPower})
                                    }}
                                    activeOpacity={.8}
                                >
                                
                                    <View style={{transform: [{rotate: this.state.cookieRot + 'deg'}], }}>
                                    
                                        <Image
                                            source={{ uri: 'https://codehs.com/uploads/6529cb528ca6905cfd4fd79a5f5bce9a' }}
                                            style={{ height: screenWidth/5.5, width: screenWidth/5.5, alignSelf: 'center' }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                <Text style={styles.cookieText}> {this.state.cps.toFixed(1)} {' '} per/sec </Text>
                        </View>
                    </View>
                    
                    <View style={{ display: this.state.stockScreens[1]}}>
                        <ImageBackground style={styles.stockC}
                            source={{ uri: 'https://codehs.com/uploads/c9ec4f8478d93ecb8113550642d1f8c7' }}
                            
                        >
                        {Object.entries(this.state.stocks).map(([k,v]) => (
                            <Image
                                source={{ uri: v[8] }}
                                style={{
                                    width: screenWidth/20,
                                    height: screenWidth/20,
                                    position: 'absolute',
                                    transform: [{ translateY: v[7] }]
                                }}>
                            </Image>
                        ))}
                        </ImageBackground>
                    </View>
                    
                    <ScrollView horizontal={true} style={styles.tabsC}>
                        {this.state.tabs.map((name) => (
                            <TouchableOpacity style={styles.tabs}
                                onPress={() => {
                                    this.changeScreen(this.state.tabs.indexOf(name), this.state.screens, name, );
                                }}
                            >   
                                <Text> {name} </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
    
                   <View style={{height: cookieHeight}}>
                        <View style={{ display: this.state.screens[0] }}>
                        {
                            <ScrollView style={styles.upgradeC}>
                                {Object.entries(this.state.buildings).map(([k,v]) => (
                                    <View style={styles.buildingBar}>
                                        <Text style={styles.towerText}>
                                            {k} - {' ' + v[1].toString()}
                                        </Text>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.increaseCost(this.state.buildings[k], this.state.buildings[k][1],);
                                            }}
                                        >
                                            <Text> {v[0]} </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                        </ScrollView>
                        }
                        </View>
                        
                        <View style={{ display: this.state.screens[1] }}>
                        {
                            <ScrollView style={styles.upgradeC}>
                                <View style={styles.buildingBar}>
                                    <Text style={styles.towerText}>Click Power - {this.state.clickPower} </Text>
                                    <TouchableOpacity style={styles.buyButton}
                                        onPress={() => {
                                        this.increaseClick();
                                        }}
                                    >
                                        <Text> {this.state.clickPrice} </Text>
                                    </TouchableOpacity>
                                </View>
                                {Object.entries(this.state.buildings).map(([k,v]) => (
                                    <View style={styles.buildingBar}>
                                        <Text style={styles.towerText}>
                                            {k} - x{this.state.multi[k][1].toFixed(2)}
                                        </Text>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.increaseMulti(this.state.multi[k], this.state.multi[k][1],);
                                        }}>
                                            <Text> {this.state.multi[k][0]} </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        }
                        </View>
                        
                        <View style = {{display: this.state.screens[2] }}> 
                        { 
                            <View style = {styles.upgradeC}>
                                <View style={{background: 'green', height: cookieHeight}}>    
                                    
                                    <View style = {{display: this.state.gambleScreens[0] }}>
                                        <View style={{justifyContent: 'space-evenly', alignItems: "center", height: cookieHeight}}>
                                            <View style={styles.gambleInput}>
                                                <TextInput
                                                    placeholder={'Enter bet amount here'}
                                                    onChangeText={(betAmount) => this.setState({betAmount})}
                                                    value={this.state.betAmount}
                                                    keyboardType='numeric'
                                                />
                                            </View>
                                        
                                            <TouchableHighlight style={styles.enterButton}
                                                    onPress={() => {
                                                        if(!this.checkNaN(this.state.betAmount)){
                                                            this.setState({gambleScreens: ["none", "block", "none", "none"],})
                                                        }
                                                    }}
                                                >
                                                <Text style={styles.gambleText}> Continue </Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    
                                    {
                                    <View style = {{display: this.state.gambleScreens[1] }}>
                                            <Text style = {styles.gambleText}> Select Dice </Text> 
                                            <View style={styles.rowContainer}>
                                            {Object.entries(this.state.gambleImages).map(([k,v]) => (
                                                    <View style = {styles.imageContainer}>
                                                        <TouchableHighlight
                                                            underlayColor={'clear'}
                                                            onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: v}) }}
                                                        >
                                                            <Image
                                                            source={{ uri: k }}
                                                            style={{ height: deviceHeight/5, width: deviceWidth / 10, resizeMode: 'contain'}}
                                                            />
                                                        </TouchableHighlight>
                                                    </View>
                                            ))}
                                                
                                                
                                            </View> 
                                    </View>
                                    } 
    
                                    {
                                    <View style = {{display: this.state.gambleScreens[2] }}>
                                    <View style={{ alignItems: "center",height: cookieHeight}}>
                                            <Text style = {styles.smallGambleText}> Select Number To Bet On </Text>
                                            <View style={styles.rowContainer}>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => {this.bigMinusPressed(); }}
                                                    >
                                                    <Text style={styles.biggerText}>-</Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => { this.minusPressed(); }}
                                                    >
                                                    <Text style={styles.bigText}>-</Text>
                                                </TouchableHighlight>
                                                <Text style = {styles.bigText}> {this.state.diceGambleNum} </Text>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => { this.plusPressed(); }}
                                                    >
                                                    <Text style={styles.bigText}>+</Text>
                                                </TouchableHighlight>
                                                <TouchableHighlight 
                                                        underlayColor = "clear"
                                                        onPressOut={() => { this.bigPlusPressed(); }}
                                                    >
                                                    <Text style={styles.biggerText}>+</Text>
                                                </TouchableHighlight>
                                            </View>
                                            <TouchableHighlight style={styles.enterButton}
                                                    onPress={() => { 
                                                        this.rollDiceMultipleTimes();
                                                    }}
                                                >
                                                <Text style={styles.gambleText}> Continue </Text>
                                            </TouchableHighlight>
                                        </View>
                                    </View>
                                    } 
                                    {
                                        <View style = {{display: this.state.gambleScreens[3] }}>
                                            <View style={{ alignItems: "center", height: cookieHeight}}>
                                                <Text style={{fontSize: deviceHeight/20, color: "white"}}> Cookies Bet: {this.state.betAmount} </Text>
                                                <Text style={styles.bigText}> {this.state.numRolled} </Text>
                                                <Text style={{fontSize: deviceHeight/20, color: "white"}}> Cookies {this.state.cookiesWonInGamble} </Text>
                                                <TouchableHighlight style={styles.enterButton}
                                                    onPress={() => {
                                                        this.setState({gambleScreens: ['block', 'none', 'none', 'none'], betAmount: '', cookiesWonInGamble: 'Won ?', diceGambleNum: 1,})
                                                    }}
                                                    >
                                                    <Text style={styles.gambleText}> Play Again </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    } 
                                </View>
                            </View>
                        }
                        </View>
                        
                        
                        <View style={{ display: this.state.screens[3]}}>
                        {
                            <ScrollView style={styles.upgradeC}>
                                {Object.entries(this.state.stocks).map(([k,v]) => (
                                    <View style={styles.buildingBar}>
                                        <Text style={styles.towerText}>
                                            {k}  {v[2].toString() + '/' + v[3].toString()}
                                        </Text>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.sellStock(k.toString());
                                            }}
                                        >
                                            <Text> Sell </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.buyButton}
                                            onPress={() => {
                                                this.buyStock(k.toString());
                                            }}
                                        >
                                            <Text> {v[0]} </Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        }
                        </View>
                        
                        <View style={{ display: this.state.screens[4]}}>
                        {
                            <View style={{display: this.state.saveScreens[0]}}>
                                <View style={styles.upgradeC}>
                                    <View style={{background: 'green', height: cookieHeight, width: deviceWidth, flex: 1,justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}}>
                                        <TouchableOpacity style={styles.saveButton}
                                            onPress={() => {
                                                if (Platform.OS === 'web'){
                                                    this.encode();
                                                    this.setState({saveScreens: ['none', 'block', 'none'],})
                                                }
                                                else 
                                                    alert('no save for phone');
                                        }}>
                                            <Text style={{fontSize: 20}}> Save </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.saveButton}
                                            onPress={() => {
                                                if (Platform.OS === 'web')
                                                    this.setState({saveScreens: ['none', 'none', 'block'],})
                                                else 
                                                    alert('no save for phone');    
                                        }}>
                                            <Text style={{fontSize: 20}}> Load </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            }
                        
                            {/* Save Screen ends here*/}
                            <View style={{display: this.state.saveScreens[1]}}>
                            {
                                <View style={styles.upgradeC}>
                                    <View style={{background: 'green', flex: 1, justifyContent: 'center'}}>
                                        <Text style={styles.gambleText} selectable={false}> Your code is </Text>
                                        <ScrollView style={{width: deviceWidth/1.2, alignSelf: 'center'}}>
                                            <Text style={{fontSize: deviceHeight/50, color: 'white'}}> {this.state.encodedCode} </Text>
                                        </ScrollView>
                                    </View>
                                </View>
                            }
                            </View>
                            
                            <View style={{display: this.state.saveScreens[2]}}>
                            {
                                <View style={styles.upgradeC}>
                                    <View style={{background: 'green', flex: 1, justifyContent: 'space-evenly'}}>
                                        <View style={{width: deviceWidth/1.2, paddingHorizontal: deviceWidth/14.9, paddingVertical: deviceHeight/26.6, alignSelf: 'center', background: 'white', borderRadius: deviceWidth/59.6}}>
                                        <TextInput 
                                            placeholder={this.state.savePh}
                                            onChangeText={(save) => this.setState({save})}
                                            value={this.state.save}
                                        />
                                        </View>
                                        <TouchableOpacity style={styles.saveButton}
                                            onPress={() => {
                                            this.load(this.state.save);
                                            this.changeScreen(0,this.state.screens);
                                        }}>
                                            <Text> Load </Text>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            }
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }

    
}

//Height is 532
//Width is 298
const styles = StyleSheet.create({
    container: {
        height: deviceHeight,
        width: deviceWidth,
        backgroundColor: '#8b6c5c',
    },
    cookieC: {
        height: deviceHeight/1.8,
        backgroundColor: '#8b6c5c',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    stockC: {
        height: deviceHeight/1.8,
        alignItems: 'flex-end',
        alignSelf: 'center',
    },
    upgradeC: {
        height: deviceHeight/3,
        width: deviceWidth,
        backgroundColor: '#a9a9a9',
    },
    buildingBar:{
        height: screenHeight/12,
        width: deviceWidth,
        backgroundColor: 'green',
        borderBottomWidth: deviceHeight/266,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buyButton: {
        height: screenHeight/20,
        width: deviceWidth/3,
        borderWidth: deviceWidth/deviceWidth,
        borderRadius: (deviceHeight/5.32)/2, //Maybe an issue
        backgroundColor: 'lightgreen',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsC: {
        flexDirection: 'row',
        width: deviceWidth,
        alignSelf: 'center',
    },
    tabs: {
        height: deviceHeight/15,
        width: deviceWidth/4,
        borderWidth: deviceWidth/deviceWidth,
        borderTopRightRadius: (screenHeight/15)/2,
        borderTopLeftRadius: (screenHeight/15)/2,
        backgroundColor: 'lightgreen',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    cpsText: {
        color: '#ffffff',
        fontSize: screenWidth/45,
        fontWeight: 'bold',
        marginTop: deviceHeight/25,
    },
    cookieText: {
        color: 'white',
        fontSize: screenWidth/45,
        fontWeight: 'bold',
    },
    bigText: {
        color: 'white',
        fontSize: screenWidth/25,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        textAlign: 'center',
        marginHorizontal: deviceWidth/30,
    },
    biggerText: {
        color: 'white',
        fontSize: screenWidth/20,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        textAlign: 'center',
        marginHorizontal: deviceWidth/30,
    },
    gambleText: {
        color: 'white',
        fontSize: screenHeight/20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    smallGambleText: {
        color: 'white',
        fontSize: screenHeight/30,
        fontWeight: 'bold',
        textAlign: "center",
    },
    smallText: {
        color: 'white',
        fontSize: screenHeight/19.867,
        fontWeight: 'bold',
        textAlign: "Center",
        marginVertical: deviceHeight / 80,
    },
    towerText: {
        width: deviceWidth - (deviceWidth/3),
        color: 'white',
        fontSize: deviceHeight/25,
        fontWeight: '200',
        justifyContent: 'flex-start',
    },
    saveButton: {
        width: deviceWidth/3,
        backgroundColor: 'white',
        borderRadius: deviceWidth/59.6,
        alignItems: 'center',
        padding: deviceHeight/25,
        alignSelf: 'center',
    },
    rowContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        marginVertical: deviceHeight / 25,
        marginHorizontal: deviceWidth/30,
        alignItems: 'center'
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: deviceWidth / 15,
        marginVertical: deviceHeight / 35,
        height: screenHeight / 20,
        width: deviceWidth/11.203,
    },
    gambleInput: {
        height: screenHeight/10,
        width: deviceWidth/1.5,
        backgroundColor: 'lightgreen',
        borderColor: 'darkgreen',
        borderWidth: screenWidth/100,
        justifyContent: 'center',
        marginTop: deviceHeight/17.674,
    },
    enterButton: {
        height: screenHeight/15,
        width: deviceWidth/2,
        backgroundColor: 'lightgreen',
        alignItems: 'center',
    },
});
