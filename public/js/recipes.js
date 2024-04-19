let recipes_toShow = [];

document.addEventListener("DOMContentLoaded", function() {
    getData();
    actualPage = sessionStorage.getItem('page') || 1; // Recupera la página actual del sessionStorage o establece 1 como valor predeterminado
});

async function getData()
{
    console.log("hola");
    await DataManager.loadData();

    recipes_toShow = recipesArray.slice();

    console.log(recipes_toShow);
}
