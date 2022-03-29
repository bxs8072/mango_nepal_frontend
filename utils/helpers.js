export const doShare = (sharer = "fb") => {
  const sharerLink = {
    fb: "https://www.facebook.com/sharer/sharer.php?u=",
    tw: "https://twitter.com/share?url=",
    li: "https://www.linkedin.com/shareArticle?mini=true&amp;url=",
  };
  const endPoint = sharer === "li" ? "&amp;source=MangoNepal" : "";

  window.open(sharerLink[sharer] + encodeURI(location.href) + endPoint, "", "width=500,height=500");
};

export const getRoleColor = (role) => {
  if (role === "Admin") return "red";
  if (role === "User") return "processing";
  if (role === "Pending") return "red";
  if (role === "Active") return "geekblue";
  return "processing";
};

export const proList = ["All", "Medical", "IT", "Engineering", "Accounting", "Lawyer", "Others"];
// export const businessList = ["All", "Medical", "IT", "Dental", "Accounting", "Lawyer", "Real Estate", "Restaurants", "Insurance", "Retail", "Others"];
export const businessList = ["Student Associations", "Non Profits"];

export const colorIntensity = (hex, lum) => {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
};
