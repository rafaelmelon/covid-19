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
import RNPickerSelect from "react-native-picker-select";

import { MonoText } from "../components/StyledText";

const SPAIN = "Spain";
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: 200,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: 200,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30 // to ensure the text is never behind the icon
  }
});

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

  const getCountriesOptions = () => {
    const options = countries.map(country => ({
      label: `${country.flag} ${country.name}`,
      value: country.name
    }));
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

  const getIconColor = (iconId, recovered) => {
    if (iconId === "md-arrow-round-up") {
      return !recovered ? "red" : "green";
    }
    if (iconId === "md-arrow-round-down") {
      return !recovered ? "green" : "red";
    }
    return "grey";
  };

  const formatNumber = number =>
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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

  const renderGlobalData = () => {
    if (globalData) {
      const { confirmed, deaths, recovered } = globalData;
      return (
        <>
          <View style={styles.statContent}>
            <Image
              source={require("../assets/images/covid.png")}
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>World cases:</Text>
            <Text style={styles.casesText}>{formatNumber(confirmed)}</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>World deaths:</Text>
            <Text style={styles.deathsText}>{formatNumber(deaths)}</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>World recovered:</Text>
            <Text style={styles.recoveredText}>{formatNumber(recovered)}</Text>
          </View>
        </>
      );
    }

    return (
      <View style={styles.statContent}>
        <Text style={styles.titleInfo}>NO DATA</Text>
      </View>
    );
  };

  const renderCountryData = () => {
    if (countryData) {
      const { date, confirmed, deaths, recovered } = countryData;
      return (
        <>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>{`Last updated: ${date}`}</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>Cases:</Text>
            <View style={styles.statValueContent}>
              <Text style={styles.casesText}>
                {formatNumber(confirmed.last)}
              </Text>
              <Ionicons
                style={{ marginHorizontal: 10 }}
                color={getIconColor(confirmed.iconId)}
                name={confirmed.iconId}
                size={20}
              />
              <Text style={styles.secondLast}>
                {formatNumber(confirmed.secondLast)}
              </Text>
            </View>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>Deaths:</Text>
            <View style={styles.statValueContent}>
              <Text style={styles.deathsText}>{formatNumber(deaths.last)}</Text>
              <Ionicons
                style={{ marginHorizontal: 10 }}
                color={getIconColor(deaths.iconId)}
                name={deaths.iconId}
                size={20}
              />
              <Text style={styles.secondLast}>
                {formatNumber(deaths.secondLast)}
              </Text>
            </View>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.titleInfo}>Recovered:</Text>
            <View style={styles.statValueContent}>
              <Text style={styles.recoveredText}>
                {formatNumber(recovered.last)}
              </Text>
              <Ionicons
                style={{ marginHorizontal: 10 }}
                color={getIconColor(recovered.iconId, true)}
                name={recovered.iconId}
                size={20}
              />
              <Text style={styles.secondLast}>
                {formatNumber(recovered.secondLast)}
              </Text>
            </View>
          </View>
        </>
      );
    }

    return (
      <View style={styles.statContent}>
        <Text style={styles.titleInfo}>NO DATA</Text>
      </View>
    );
  };

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
          <View style={styles.selectContainer}>
            <RNPickerSelect
              value={selectedValue}
              onValueChange={handleChangeCountry}
              style={pickerSelectStyles}
              items={getCountriesOptions()}
            />
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
  selectContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 60
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 0,
    marginLeft: -10,
    marginBottom: 10
  },
  statContent: {
    alignItems: "center",
    marginHorizontal: 50,
    marginBottom: 10
  },
  statValueContent: {
    alignItems: "center",
    flexDirection: "row"
  },
  titleInfo: {
    fontSize: 18,
    color: "rgba(0,0,0, 0.7)",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 5
  },
  secondLast: {
    fontSize: 14,
    color: "rgba(0,0,0, 0.5)",
    fontWeight: "bold",
    lineHeight: 24,
    textAlign: "center"
  },
  casesText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#695795",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5
  },
  deathsText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#BF5B04",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5
  },
  recoveredText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#018C0D",
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5
  },
  helpLinkText: {
    fontSize: 14,
    color: "#695795"
  }
});
