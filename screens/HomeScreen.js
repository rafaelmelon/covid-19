import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";

import Cases from "../components/Cases";
import Deaths from "../components/Deaths";
import Recovered from "../components/Recovered";
import Colors from "../constants/Colors";
import { formatNumber, getIconId } from "../utils/helpers";

const SPAIN = "Spain";
const pickerSelectStyles = StyleSheet.create({
  viewContainer: {
    alignSelf: "center",
  },
  inputIOS: {
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 4,
    color: Colors.black,
    backgroundColor: Colors.select,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: 300,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.cases,
    borderRadius: 8,
    color: Colors.black,
    backgroundColor: Colors.select,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = React.useState(SPAIN);

  const [countries, setCountries] = React.useState([]);
  const [countriesData, setCountriesData] = React.useState({});
  const [countryData, setCountryData] = React.useState(null);
  const [globalData, setGlobalData] = React.useState(null);

  const [isLoadingCountries, setLoadingCountries] = React.useState(true);
  const [isLoadingTimeSeries, setLoadingTimeseries] = React.useState(true);

  const scale = React.useRef(new Animated.Value(1)).current;
  const rotate = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ]),
      {}
    ).start();
  }, []);

  React.useEffect(() => {
    fetch("https://pomber.github.io/covid19/timeseries.json")
      .then((response) => response.json())
      .then((json) => {
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
          recovered,
        });
        setCountryData(getCountryData(json[SPAIN]));
        return setCountriesData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingTimeseries(false));
  }, []);

  React.useEffect(() => {
    fetch("https://pomber.github.io/covid19/countries.json")
      .then((response) => response.json())
      .then((json) => {
        const formatJson = Object.keys(json).map((i) => ({
          name: i,
          flag: json[i].flag,
          code: json[i].code,
        }));

        return setCountries(formatJson);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoadingCountries(false));
  }, []);

  const getCountriesOptions = () => {
    const options = countries.map((country) => ({
      label: `${country.flag} ${country.name}`,
      value: country.name,
    }));
    return options;
  };

  const getData = (lastData, secondLastData, thirdLastData, key) => {
    const today = lastData[key] - secondLastData[key];
    const yesterday = secondLastData[key] - thirdLastData[key];

    return {
      total: formatNumber(lastData[key]),
      today: formatNumber(today),
      yesterday: formatNumber(yesterday),
      iconId: getIconId(today - yesterday),
    };
  };

  const getCountryData = (days) => {
    if (days) {
      const lastData = days[days.length - 1];
      const secondLastData = days[days.length - 2];
      const thirdLastData = days[days.length - 3];

      return {
        date: lastData.date,
        confirmed: getData(
          lastData,
          secondLastData,
          thirdLastData,
          "confirmed"
        ),
        deaths: getData(lastData, secondLastData, thirdLastData, "deaths"),
        recovered: getData(
          lastData,
          secondLastData,
          thirdLastData,
          "recovered"
        ),
        stats: [
          days[days.length - 5],
          days[days.length - 4],
          days[days.length - 3],
          days[days.length - 2],
          days[days.length - 1],
        ],
      };
    }

    return null;
  };

  const handleChangeCountry = (country) => {
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
          <View style={styles.row}>
            <Animated.Image
              source={require("../assets/images/covid.png")}
              style={{
                width: 100,
                height: 80,
                resizeMode: "contain",
                marginTop: 0,
                marginLeft: -10,
                marginBottom: 10,
                transform: [
                  {
                    scale,
                    rotate: rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>World cases:</Text>
            <Text style={styles.casesText}>{formatNumber(confirmed)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>World deaths:</Text>
            <Text style={styles.deathsText}>{formatNumber(deaths)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>World recovered:</Text>
            <Text style={styles.recoveredText}>{formatNumber(recovered)}</Text>
          </View>
        </>
      );
    }

    return (
      <View style={styles.row}>
        <Text style={styles.title}>NO DATA</Text>
      </View>
    );
  };

  const renderCountryData = () => {
    if (countryData) {
      const { date, confirmed, deaths, recovered, stats } = countryData;

      return (
        <>
          <Cases countryData={countryData} />
          <Deaths countryData={countryData} />
          <Recovered countryData={countryData} />
        </>
      );
    }

    return (
      <View style={styles.row}>
        <Text style={styles.title}>NO DATA</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {isLoadingTimeSeries ? (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={Colors.cases} />
          </View>
        ) : (
          renderGlobalData()
        )}

        {isLoadingCountries || countries.length === 0 ? (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={Colors.cases} />
          </View>
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

        {isLoadingTimeSeries ? (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={Colors.cases} />
          </View>
        ) : (
          renderCountryData()
        )}
      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
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
  indicator: {
    marginVertical: 15,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  selectContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  developmentModeText: {
    marginBottom: 20,
    color: Colors.title,
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  row: {
    alignItems: "center",
    marginHorizontal: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: Colors.title,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 5,
  },
  casesText: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.cases,
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5,
  },
  deathsText: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.deaths,
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5,
  },
  recoveredText: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.recovered,
    lineHeight: 35,
    textAlign: "center",
    marginBottom: 5,
  },
  helpLinkText: {
    fontSize: 14,
    color: Colors.cases,
  },
});
