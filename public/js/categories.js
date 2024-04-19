let categories_toShow = [];

document.addEventListener("DOMContentLoaded", function() {
    getData();
    // Recupera la página actual del sessionStorage o establece 1 como valor predeterminado
});

async function getData()
{
    //console.log("hola");
    await categoryManager.loadData();

    categories_toShow = categories.slice();

    console.log(categories_toShow);
}
