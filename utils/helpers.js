export const formatNumber = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const getIconColor = (iconId, key) => {
  switch (iconId) {
    case "md-arrow-up":
      if (key !== "recovered") {
        return "red";
      }
      return "green";
    case "md-arrow-down":
      if (key !== "recovered") {
        return "green";
      }
      return "red";
    default:
      return "grey";
  }
};

export const getIconId = (number, key) => {
  if (number < 0) {
    return "md-arrow-down";
  }
  if (number > 0) {
    return "md-arrow-up";
  }
  return "md-arrow-forward";
};
