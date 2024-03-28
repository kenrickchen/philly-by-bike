import TOKEN from "./token";

var options = {
    searchOptions: {
      key: TOKEN,
      language: "en-US",
      limit: 5,
    },
    autocompleteOptions: {
      key: TOKEN,
      language: "en-US",
    },
}

var ttSearchBox = new tt.plugins.SearchBox(tt.services, options);
var map = tt.map({
    key: TOKEN,
    container: "map",
})