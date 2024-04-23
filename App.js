import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, Image, TouchableHighlight, TouchableOpacity, Alert, Dimensions, ScrollView, TextInput, } from 'react-native';
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
        screens: ['none', 'none', 'block', 'none', 'none', 'none', 'none'], // DONT SAVE
        gambleScreens: ['none', 'none', 'block', 'none'], // DONT SAVE
        stockScreens: ['block', 'none '],
        diceGambleNum: 1, // DONT SAVE
        maxDiceNum: 0, // DONT SAVE
        numRolled: 0, // DONT SAVE
        betAmount: "", // DONT SAVE
        cookiesWonInGamble: "Won: ?", // DONT SAVE
        cookies: 111111111111110.00,
        cookieS: '',
        cookieRot: 0, // DONT SAVE
        clickPower: 1,
        clickPrice: 500,
        cps: 0.00, //DONT SAVE
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
        //buildings to click for you
        //FOR BUILDINGS = 0:COST, 1:AMOUNT, 2:CPS, 3: OG COST
        buildings: {
            'Pointers': [15, 1, 0.1, 15],
            'Grandmas': [100, 1, 1.0, 100],
            'Farms': [1100, 1, 8.0, 1100],
            'Mines': [12000, 1, 47.0, 12000],
            'Factory': [130000, 1, 260.0, 130000],
            'Bank': [1400000, 1, 1400, 1400000],
            'Temple': [20000000, 0, 7800, 20000000],
            'Wizard Tower': [330000000, 0, 44000, 330000000]
        },
        // cps of tower * amount of multi[1]
        //FOR multi = 0:COST, 1:AMOUNT
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
        //FOR stocks = 0:COST, 1:OG price,  2:AMOUNT BOUGHT, 3: LIMIT TO BUY AMOUNT, 4: UP TIME OF STOCK, 5: Y CORDS
        stocks: {
          'Sugar': [10, 10, 0, 1, 1.0, deviceHeight/1.9/2],
          'Dough': [15, 15, 0, 1, 1.0, deviceHeight/1.9/2],
          'Chocolate': [25, 25, 1, 0, 1.0, deviceHeight/1.9/2],
          'Flour': [75, 75, 0, 1, 1.0, deviceHeight/1.9/2],
          'Coco Powder': [150, 150, 0, 1, 1.0,  deviceHeight/1.9/2],
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
        //if gambling tab, reset gambling info
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
    }; //Changes Screens
    
    addAllCookies = setInterval(() => {
        var total = 0;
        var names = Object.keys(this.state.buildings);
        for(let i = 0; i < Object.values(this.state.buildings).length; i++) {
            total = total + ( (this.state.buildings[names[i]][1]*this.state.buildings[names[i]][2]) * this.state.multi[names[i]][1])
        }
        this.setState({ cookies: this.state.cookies + total, cps: total});
    }, 1000 );
    
    //COOKIE ROTATION
    cookieRotation = setInterval(() => {
        // sets the rotation of the cookie by change rot every 50 ms by 2 degrees
        this.setState({
            cookieRot: this.state.cookieRot+.25,
        });
    },50); //this is the interval in milliseconds
    // BUYING AND INCREASEING PRICES OF THE INCOMING BUILDING
    increaseCost = (building, amt) => {
        // see if the player has enough cookies to buy
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
        // see if the player has enough cookies to buy
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
    
    plusPressed = () => { 
        if(this.state.diceGambleNum < this.state.maxDiceNum) this.setState({diceGambleNum: this.state.diceGambleNum + 1})
    };
    minusPressed = () => { 
        if(this.state.diceGambleNum > 1) this.setState({diceGambleNum: this.state.diceGambleNum - 1})
    };
    
    rollDice = () => {
       this.setState({
            //this number rolled will show for 50ms only
            numRolled: Math.floor((Math.random() * this.state.maxDiceNum) + 1)
        }); 
    };
    rollDiceMultipleTimes = async () => {
        this.setState({gambleScreens: ["none", "none", "none", "block"]});
        if(parseInt(this.state.betAmount) > this.state.cookies) this.setState({betAmount: this.state.cookies});
        if(parseInt(this.state.betAmount) < 0) this.setState({betAmount: 0});
        this.setState({
            //this number rolled will show for 50ms only
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
        
        if(!base64Regex.test(code) || code.length < 150) {
            alert("invalid Code");
            this.setState({ save: '',});
            return;
        }
        
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
            clickPrice: Number(clickPrice)
        });
    }
    encode = () => {
        const { buildings, multi, cookies, clickPower, clickPrice } = this.state;
        const names = Object.keys(buildings);
    
        // Encode building variables
        const buildVars = names.map(name => Object.values(buildings[name]).join(','));
        const buildingsCode = buildVars.join('|') + '/';
    
        // Encode multiplier variables
        const multiVars = names.map(name => Object.values(multi[name]).join(','));
        const multipliersCode = multiVars.join('|') + '/';
    
        // Encode the entire state
        const encoded = btoa(cookies + '/' + buildingsCode + multipliersCode + clickPower + '/' + clickPrice);
        
        this.setState({ encodedCode: encoded });
    }
    
    checkNaN = (value) => {
        if(value.toString().length <= 0){
            alert('NaN');
            return true;
        }
        else {
            return false;
        }
    }

    stockChanges = setInterval(() => {
        const { stocks, buildings } = this.state;
        const stockNames = Object.keys(stocks);
        const buildingNames = Object.keys(buildings);
        var stockChangeAmount = 0;
        for(let i = 0; i < stockNames.length; i++) {
            stocks[stockNames[i]][3] = buildings[buildingNames[i]][1]
            var randomNumberBatch = Math.ceil(25 / (stocks[stockNames[i]][4] / 5));
            
            if(randomNumberBatch < 5) {
                randomNumberBatch = 5;
            }
            else if(randomNumberBatch > 100){
                randomNumberBatch = 100;
            }

            for(let i = 0; i < randomNumberBatch; i++)
                stockChangeAmount += Math.ceil(Math.random() * 100)
            
        stockChangeAmount /= randomNumberBatch;
        stockChangeAmount *= 0.1;
        stocks[stockNames[i]][0] *= stockChangeAmount;
        }
    }, 7000);
    

    render() {
        return (
            <View style={styles.container}>
                <View style={{ display: this.state.stockScreens[0]}}>
                    <View style={styles.cookieC}> 
                    
                    {/* amount of cookies you have current*/}
                            <Text style={styles.cpsText}> 
                                {this.state.cookies.toFixed(1) + " Cookies"} 
                            </Text>
                            {/* Cookie to click on and adds yout current click power's amount to total cookies */}
                            <TouchableOpacity style={{ borderRadius: (screenHeight/5.5), background: 'grey' }}
                                onPress={() => {
                                    this.setState({cookies: this.state.cookies+this.state.clickPower})
                                }}
                                activeOpacity={.8}
                            >
                            {/* cookie spin */}
                                <View style={{transform: [{rotate: this.state.cookieRot + 'deg'}], }}>
                                {/* cookie's image */}
                                    <Image
                                        source={{ uri: 'https://codehs.com/uploads/6529cb528ca6905cfd4fd79a5f5bce9a' }}
                                        style={{ height: screenWidth/5.5, width: screenWidth/5.5, alignSelf: 'center' }}
                                    />
                                </View>
                            </TouchableOpacity>
                            {/* total amount all your buildings are clicking for you per second */}
                            <Text style={styles.cookieText}> {this.state.cps.toFixed(1)} {' '} per/sec </Text>
                    </View>
                </View>
                
                <View style={{ display: this.state.stockScreens[1]}}>
                    <View style={styles.stockC}>
                        <View style={{
                            width: 25,
                            height: 25,
                            backgroundColor: 'green',
                            position: 'absolute',
                            transform: [{ translateY: this.state.stocks['Sugar'][3] }]
                        }}>
                        
                        </View>
                    </View>
                </View>
                
                <ScrollView horizontal={true} style={styles.tabsC}>
                {/* tabs to go to different screens */}
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
               
                <View style={{ display: this.state.screens[0] }}> {/* where you buy all the different buildings with changing amounts */}
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
                    {/* buy multiplication to buildings */}
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
                
                <View style = {{display: this.state.screens[2] }}> {/*DO NOT TOUCH STYLING WITHOUT A BACKUP, THINGS ARE A BIT WHACKY AND PARTICULAR*/}
                { 
                    <View style = {styles.upgradeC}>
                        <View style={{background: 'green', height: cookieHeight}}>    
                            {
                                
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
                            } {/*Insert Bet Amount Screen*/}
                            {
                            <View style = {{display: this.state.gambleScreens[1] }}>
                                <View style={{}}>
                                    <Text style = {styles.gambleText}> Select Dice </Text> 
                                    { <View>
                                        <View style={styles.rowContainer}>
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 2}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/e9ab66d0a796ea164363e7e3830e7239' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}
                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 4}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/f2b51d987924500632b6d17b52fea0ee' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}
                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 6}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/3a347f2d33efd9d497f601c800f0c83e' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 8}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/5fd52273379e5f598a79ed9ffb4acdc5' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}                                                    />
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                        
                                        <View style={styles.rowContainer}>
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 10}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/7627dcfd38370770b273d947e4c6bf2d' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 12}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/c596cad96509fb446fd417a6e2179091' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 20}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/4ea8cafa629229f5a97886925924033e' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}                                                    />
                                                </TouchableHighlight>
                                            </View>
                                            
                                            <View style = {styles.imageContainer}>
                                                <TouchableHighlight 
                                                    underlayColor = "clear"
                                                    onPress={() => { this.setState({gambleScreens: ["none", "none", "block", "none"], maxDiceNum: 100}) }}
                                                >
                                                    <Image
                                                    source={{ uri: 'https://codehs.com/uploads/3cb71656381b30606f50f37ec63ead60' }}
                                                    style={{ height: screenHeight/15, width: screenWidth / 20, resizeMode: 'contain'}}                                                    />
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                     </View> } {/*Dice Buttons*/}
                                </View>
                            </View>
                            } {/*Dice Select Screen*/}
                            {
                            <View style = {{display: this.state.gambleScreens[2] }}>
                               <View style={{ alignItems: "center",height: cookieHeight,}}>
                                    <Text style = {styles.smallGambleText}> Select Number To Bet On </Text>
                                    <View style={styles.rowContainer}>
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
                            } {/*Number Select Screen*/}
                            {
                                <View style = {{display: this.state.gambleScreens[3] }}>
                                    <View style={{justifyContent: 'center', alignItems: "center"}}>
                                        <Text style={{marginHorizontal: deviceWidth/14.9, marginVertical: deviceHeight/26.6, fontSize: deviceWidth/14.9, color: "white"}}> Cookies Bet: {this.state.betAmount} </Text>
                                        <Text style={styles.bigText}> {this.state.numRolled} </Text>
                                        <Text style={{marginHorizontal: deviceWidth/14.9, marginVertical: deviceHeight/26.6, fontSize: deviceWidth/14.9, color: "white"}}> Cookies {this.state.cookiesWonInGamble} </Text>
                                    </View>
                                </View>
                            } {/*Rolling / Payout Screen*/}
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
                                    {k} - {' ' + v[1].toString()}
                                </Text>
                                <TouchableOpacity style={styles.buyButton}
                                    onPress={() => {
                                        alert('Clicked ' + k)
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
                    <View style={styles.upgradeC}>
                        <View style={{background: 'green', flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.saveButton}
                                onPress={() => {
                                this.encode();
                                this.changeScreen(5, this.state.screens);
                            }}>
                                <Text> Save </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.saveButton}
                                onPress={() => {
                                    this.changeScreen(6, this.state.screens);
                            }}>
                                <Text> Load </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                </View>
                {/* Save Screen ends here*/}
                <View style={{display: this.state.screens[5]}}>
                {
                    <View style={styles.upgradeC}>
                        <View style={{background: 'green', flex: 1, justifyContent: 'center'}}>
                            <Text style={styles.gambleText} selectable={false}> Your code is </Text>
                            <Text style={styles.smallText}>
                            {this.state.encodedCode}
                            </Text>
                        </View>
                    </View>
                }
                </View>
                
                <View style={{display: this.state.screens[6]}}>
                {
                    <View style={styles.upgradeC}>
                        <View style={{background: 'green', flex: 1, justifyContent: 'center'}}>
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
        );
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
        height: deviceHeight/1.75,
        backgroundColor: 'red',
        alignItems: 'flex-start',
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
        justifyContent: 'flex-end',
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
        textAlign: "center",
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
        width: deviceWidth/0.851,
        color: 'white',
        fontSize: screenHeight/25,
        fontWeight: '200',
        justifyContent: 'flex-start',
    },
    saveButton: {
        width: deviceWidth/3,
        background: 'white',
        borderRadius: deviceWidth/59.6,
        paddingVertical: deviceHeight/26.6,
        textAlign: 'center',
        marginHorizontal: deviceWidth/19.867,
        alignSelf: 'center',
    },
    rowContainer: {
        flexDirection: "row",
        marginVertical: deviceHeight / 30,
        marginHorizontal: deviceWidth/16.805,
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: deviceWidth / 15,
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
