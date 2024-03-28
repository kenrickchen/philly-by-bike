var options = {
    searchOptions: {
      key: "",
      language: "en-US",
      limit: 5,
    },
    autocompleteOptions: {
      key: "",
      language: "en-US",
    },
}

var ttSearchBox = new tt.plugins.SearchBox(tt.services, options);
var map = tt.map({
    key: "",
    container: "map",
})