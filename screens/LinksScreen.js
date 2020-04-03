import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";

export default function LinksScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <OptionButton
        icon="md-arrow-dropright"
        label="World Health Organization (WHO)"
        onPress={() => WebBrowser.openBrowserAsync("https://www.who.int/")}
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="DXY.cn. Pneumonia. 2020"
        onPress={() =>
          WebBrowser.openBrowserAsync("http://3g.dxy.cn/newh5/view/pneumonia")
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="National Health Commission of the People’s Republic of China (NHC):"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="China CDC (CCDC)"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "http://weekly.chinacdc.cn/news/TrackingtheEpidemic.htm"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Hong Kong Department of Health"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://www.chp.gov.hk/en/features/102465.html"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Macau Government"
        onPress={() =>
          WebBrowser.openBrowserAsync("https://www.ssm.gov.mo/portal/")
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Taiwan CDC"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://sites.google.com/cdc.gov.tw/2019ncov/taiwan?authuser=0"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="US CDC"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://www.cdc.gov/coronavirus/2019-ncov/index.html"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Government of Canada"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://www.canada.ca/en/public-health/services/diseases/coronavirus.html"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Australia Government Department of Health"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://www.health.gov.au/news/coronavirus-update-at-a-glance"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="European Centre for Disease Prevention and Control (ECDC)"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Ministry of Health Singapore (MOH)"
        onPress={() =>
          WebBrowser.openBrowserAsync("https://www.moh.gov.sg/covid-19")
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="Italy Ministry of Health"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "http://www.salute.gov.it/nuovocoronavirus"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="1Point3Arces"
        onPress={() =>
          WebBrowser.openBrowserAsync("https://coronavirus.1point3acres.com/en")
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="WorldoMeters"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://www.worldometers.info/coronavirus/"
          )
        }
      />
      <OptionButton
        icon="md-arrow-dropright"
        label="BNO News"
        onPress={() =>
          WebBrowser.openBrowserAsync(
            "https://bnonews.com/index.php/2020/02/the-latest-coronavirus-cases/"
          )
        }
        isLastOption
      />
    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  contentContainer: {
    paddingTop: 15
  },
  optionIconContainer: {
    marginRight: 12
  },
  option: {
    backgroundColor: "#fdfdfd",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: "#ededed"
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  optionText: {
    fontSize: 15,
    alignSelf: "flex-start",
    marginTop: 1
  }
});
