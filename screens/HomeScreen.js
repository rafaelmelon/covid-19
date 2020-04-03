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
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

import { MonoText } from "../components/StyledText";

const SPAIN = "Spain";

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = React.useState(SPAIN);

  const [countries, setCountries] = React.useState([]);
  const [countriesData, setCountriesData] = React.useState({});
  const [countryData, setCountryData] = React.useState(null);
  const [globalData, setGlobalData] = React.useState(null);

  const [isLoadingCountries, setLoadingCountries] = React.useState(true);
  const [isLoadingTimeSeries, setLoadingTimeseries] = React.useState(true);

  React.useEffect(() => {
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then(response => response.json())
      .then(json => {
        const confirmed = Object.keys(json).reduce(
          (a, b) => a + json[b][json[b].length - 1].confirmed,
          0
        );
        const deaths = Object.keys(json).reduce(
          (a, b) => a + json[b][json[b].length - 1].deaths,
          0
        );

        const recovered = Object.keys(json).reduce(
          (a, b) => a + json[b][json[b].length - 1].recovered,
          0
        );

        setGlobalData({
          date: "date",
          confirmed,
          deaths,
          recovered
        });
        setCountryData(getCountryData(json[SPAIN]));
        return setCountriesData(json);
      })
      .catch(error => console.error(error))
      .finally(() => setLoadingTimeseries(false));
  }, []);

  React.useEffect(() => {
    fetch("https://pomber.github.io/covid19/countries.json")
      .then(response => response.json())
      .then(json => {
        const formatJson = Object.keys(json).map(i => ({
          name: i,
          flag: json[i].flag,
          code: json[i].code
        }));

        return setCountries(formatJson);
      })
      .catch(error => console.error(error))
      .finally(() => setLoadingCountries(false));
  }, []);

  const renderPickerItems = () => {
    const options = countries.map(country => (
      <Picker.Item
        key={country.name}
        label={`${country.flag} ${country.name}`}
        value={country.name}
      />
    ));
    return options;
  };

  const getIconId = (a, b) => {
    if (a > b) {
      return "md-arrow-round-up";
    }
    if (a < b) {
      return "md-arrow-round-down";
    }
    return "md-arrow-round-forward";
  };

  const getIconColor = iconId => {
    if (iconId === "md-arrow-round-up") {
      return "red";
    }
    if (iconId === "md-arrow-round-down") {
      return "green";
    }
    return "grey";
  };

  const getCountryData = array => {
    if (array) {
      const lastData = array[array.length - 1];
      const secondLastData = array[array.length - 2];

      return {
        date: lastData.date,
        confirmed: {
          last: lastData.confirmed,
          secondLast: secondLastData.confirmed,
          iconId: getIconId(lastData.confirmed, secondLastData.confirmed)
        },
        deaths: {
          last: lastData.deaths,
          secondLast: secondLastData.deaths,
          iconId: getIconId(lastData.deaths, secondLastData.deaths)
        },
        recovered: {
          last: lastData.recovered,
          secondLast: secondLastData.recovered,
          iconId: getIconId(lastData.recovered, secondLastData.recovered)
        }
      };
    }

    return null;
  };

  const handleChangeCountry = country => {
    const countryDataArray = countriesData[country];
    const data = getCountryData(countryDataArray);

    setSelectedValue(country);
    setCountryData(data);
  };

  const renderCountryData = () => {
    if (countryData) {
      const { date, confirmed, deaths, recovered } = countryData;
      return (
        <>
          <View style={styles.getStatContainer}>
            <MonoText
              style={styles.codeHighlightText}
            >{`Last updated: ${date}`}</MonoText>
          </View>

          <View style={styles.getStatContainer}>
            <Text style={styles.getTitleText}>Cases:</Text>
            <View style={styles.getValueContainer}>
              <Text style={styles.getCasesText}>{confirmed.last}</Text>
              <Ionicons
                style={{ marginHorizontal: 5 }}
                color={getIconColor(confirmed.iconId)}
                name={confirmed.iconId}
                size={20}
              />
              <Text style={styles.getSecondLast}>{confirmed.secondLast}</Text>
            </View>
          </View>

          <View style={styles.getStatContainer}>
            <Text style={styles.getTitleText}>Deaths:</Text>
            <View style={styles.getValueContainer}>
              <Text style={styles.getDeathsText}>{deaths.last}</Text>
              <Ionicons
                style={{ marginHorizontal: 5 }}
                color={getIconColor(deaths.iconId)}
                name={deaths.iconId}
                size={20}
              />
              <Text style={styles.getSecondLast}>{deaths.secondLast}</Text>
            </View>
          </View>

          <View style={styles.getStatContainer}>
            <Text style={styles.getTitleText}>Recovered:</Text>
            <View style={styles.getValueContainer}>
              <Text style={styles.getRecoveredText}>{recovered.last}</Text>
              <Ionicons
                style={{ marginHorizontal: 5 }}
                color={getIconColor(recovered.iconId)}
                name={recovered.iconId}
                size={20}
              />
              <Text style={styles.getSecondLast}>{recovered.secondLast}</Text>
            </View>
          </View>
        </>
      );
    }

    return (
      <View style={styles.getStatContainer}>
        <Text style={styles.getTitleText}>NO DATA</Text>
      </View>
    );
  };

  const renderGlobalData = () => {
    if (globalData) {
      const { confirmed, deaths, recovered } = globalData;
      return (
        <>
          <View style={styles.welcomeContainer}>
            <Image
              source={require("../assets/images/covid19.png")}
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStatContainer}>
            <MonoText
              style={styles.codeHighlightText}
            >{`Last updated: 12312312`}</MonoText>
          </View>

          <View style={styles.getStatContainer}>
            <Text style={styles.getTitleText}>Cases:</Text>
            <Text style={styles.getCasesText}>{confirmed}</Text>
          </View>

          <View style={styles.getStatContainer}>
            <Text style={styles.getTitleText}>Deaths:</Text>
            <Text style={styles.getDeathsText}>{deaths}</Text>
          </View>

          <View style={styles.getStatContainer}>
            <Text style={styles.getTitleText}>Recovered:</Text>
            <Text style={styles.getRecoveredText}>{recovered}</Text>
          </View>
        </>
      );
    }

    return (
      <View style={styles.getStatContainer}>
        <Text style={styles.getTitleText}>NO DATA</Text>
      </View>
    );
  };

  console.log(globalData);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {isLoadingTimeSeries ? <ActivityIndicator /> : renderGlobalData()}

        {isLoadingCountries || countries.length === 0 ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.getSelectPickerContainer}>
            <Picker
              selectedValue={selectedValue}
              style={styles.getSelectPicker}
              onValueChange={(itemValue, itemIndex) =>
                handleChangeCountry(itemValue)
              }
            >
              {renderPickerItems()}
            </Picker>
          </View>
        )}

        {isLoadingTimeSeries ? <ActivityIndicator /> : renderCountryData()}
      </ScrollView>
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
    borderColor: "#aaa"
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
    marginHorizontal: 50,
    marginBottom: 10
  },
  getValueContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
    marginBottom: 5
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
  getSecondLast: {
    fontSize: 14,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  getCasesText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#aaa",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5
  },
  getDeathsText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#696969",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5
  },
  getRecoveredText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#8ACA2B",
    lineHeight: 35,
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
