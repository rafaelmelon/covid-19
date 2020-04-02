import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Picker
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";

import { MonoText } from "../components/StyledText";

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = React.useState("Spain");
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  const [countries, setCountries] = React.useState({});
  const [countriesData, setCountriesData] = React.useState({});
  const [countryData, setCountryData] = React.useState([]);

  React.useEffect(() => {
    fetch("https://pomber.github.io/covid19/countries.json")
      .then(response => response.json())
      .then(json => {
        const peopleArray = Object.keys(json).map(i => ({
          name: i,
          flag: json[i].flag,
          code: json[i].code
        }));

        return setCountries(peopleArray);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    // fetch("https://reactnative.dev/movies.json")
    //   .then(response => response.json())
    //   .then(json => setData(json.movies))
    //   .catch(error => console.error(error))
    //   .finally(() => setLoading(false));

    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(json => setCountriesData(json))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleChangeCountry = country => {
    const countryArray = countriesData[country];

    setSelectedValue(country);
    setCountryData(countryArray[countryArray.length - 1]);
  };

  console.log(countries);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require("../assets/images/covid19.png")
                : require("../assets/images/covid19.png")
            }
            style={styles.welcomeImage}
          />
          <Text style={styles.tabBarInfoText}>
            Last updated: April 01, 2020, 17:34 GMT
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <Text>
                {item.title}, {item.releaseYear}
              </Text>
            )}
          />
        )}

        <View style={styles.getStatContainer}>
          <Text style={styles.getTitleText}>Coronavirus Cases:</Text>
          <Text style={styles.getCasesText}>912,098</Text>
        </View>

        <View style={styles.getStatContainer}>
          <Text style={styles.getTitleText}>Deaths:</Text>
          <Text style={styles.getDeathsText}>45,540</Text>
        </View>

        <View style={styles.getStatContainer}>
          <Text style={styles.getTitleText}>Recovered:</Text>
          <Text style={styles.getRecoveredText}>190,933</Text>
        </View>

        <View style={styles.getSelectPickerContainer}>
          <Picker
            selectedValue={selectedValue}
            style={styles.getSelectPicker}
            onValueChange={(itemValue, itemIndex) =>
              handleChangeCountry(itemValue)
            }
          >
            <Picker.Item label="Spain" value="Spain" />
            <Picker.Item label="Italy" value="Italy" />
          </Picker>
        </View>

        <View style={styles.getStatContainer}>
          <Text style={styles.getTitleText}>Coronavirus Cases:</Text>
          <Text style={styles.getCasesText}>912,098</Text>
        </View>

        <View style={styles.getStatContainer}>
          <Text style={styles.getTitleText}>Deaths:</Text>
          <Text style={styles.getDeathsText}>45,540</Text>
        </View>

        <View style={styles.getStatContainer}>
          <Text style={styles.getTitleText}>Recovered:</Text>
          <Text style={styles.getRecoveredText}>190,933</Text>
        </View>
      </ScrollView>

      {/* <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          This is a tab bar. You can edit it in:
        </Text>

        <View
          style={[styles.codeHighlightContainer, styles.navigationFilename]}
        >
          <MonoText style={styles.codeHighlightText}>
            navigation/BottomTabNavigator.js
          </MonoText>
        </View>
      </View> */}
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/workflow/development-mode/"
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change"
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  getSelectPickerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  getSelectPicker: {
    width: 200,
    alignItems: "center",
    backgroundColor: "#aaa"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 20
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 0,
    marginLeft: -10,
    marginBottom: 10
  },
  getStatContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 5
  },
  getTitleText: {
    fontSize: 18,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 5
  },
  getCasesText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#aaa",
    lineHeight: 30,
    textAlign: "center",
    marginBottom: 5
  },
  getDeathsText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#696969",
    lineHeight: 30,
    textAlign: "center",
    marginBottom: 5
  },
  getRecoveredText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#8ACA2B",
    lineHeight: 30,
    textAlign: "center",
    marginBottom: 5
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
