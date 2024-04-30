let recipes_toShow = [];
let categories = []

let actualpage;
let pageSize = 6

document.addEventListener("DOMContentLoaded", function() {
    actualPage = sessionStorage.getItem('recipe_page') || 1;
    getData();
});

async function getData()
{
    let resp = await fetch('/api/recipes/search',{
        method :'GET'
    })

    console.log(resp.status);
    let data = await resp.json()

    console.log(data);
    
    recipes_toShow = data.recipes;

    // let html = toHtml(View.toHtmlList,recipes_toShow);
    // View.render(html, "recipes_display");

    pagination(actualpage)

    loadCategories()
    
}

async function loadCategories()
{
    let resp = await fetch('/api/categories',{
        method :'GET',
        headers: {
            'x-auth': 23423
        }
    })

    console.log(resp.status);
    let data = await resp.json()

    console.log(data);
    
    categories = data.categories;

    console.log(categories);

    categorySelect()
}

function categorySelect() {
    var categorySelectMenu = document.getElementById("categorySelect");

    categories.forEach(function(category) {
        var option = document.createElement("option");
        option.innerHTML = category.name;
        option.setAttribute("value", category.name);
        categorySelectMenu.appendChild(option);
    });
}

function toHtml(fnToHtml = View.toHtmlList, prodlist) {
    console.log("entro");
    return fnToHtml(prodlist);
}

function pagination(page=1, prodlist = recipes_toShow, fnToHtml = View.toHtmlList, pagesize = pageSize) {
        
    sessionStorage.setItem("recipe_page", page);
    actualPage = page;

    // Calcula el índice inicial y final de los productos a mostrar en la página
    let startIndex = (page - 1) * pagesize;
    let endIndex = startIndex + pagesize;
    
    // Filtra los productos para mostrar solo los de la página actual
    let recipes_to_show = prodlist.slice(startIndex, endIndex);

    console.log(recipes_to_show);

    pageLogic(prodlist,pageSize);

    // Renderiza los productos de la página actual
    let html = toHtml(fnToHtml,recipes_to_show);
    View.render(html, "recipes_display");
}


function pageLogic(prodList, pageSize)
{
    const totalPages = Math.ceil(prodList.length / pageSize);

    console.log(prodList);

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        let encodedProdList = encodeURIComponent(JSON.stringify(prodList));
        if (i === parseInt(sessionStorage.getItem("page"))) {
            paginationHTML += `<li class="page-item active"><a class="page-link" href="#" onclick="pagination(${i}, JSON.parse(decodeURIComponent('${encodedProdList}')))">${i}</a></li>`;
        } else {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="pagination(${i}, JSON.parse(decodeURIComponent('${encodedProdList}')))">${i}</a></li>`;
        }
    }


    document.getElementById('pagination').innerHTML = paginationHTML;

    if (totalPages === 0) {
        document.getElementById('pagination').style.display = 'none';
    } else {
        document.getElementById('pagination').style.display = 'flex';
    }
}

class View
{

    static render(html, elementId){
        document.querySelector(`#${elementId}`).innerHTML = html;
    }

    static toHtmlList(list){
        console.log("entro2");
        let html = `
                    ${list.map((prod) => View.toHtmlDiv(prod)).join("")}
                
                    `;
        return html;
    }
    
    static toHtmlDiv(obj) {
        let html = `
        <div class="col">
        <div class="card position-relative" style="width: 18rem;">
            <img src="${obj.photo}" class="card-img-top" alt="...">
            <div class="card-body">
                <h3 class="card-title">${obj.title}</h3>
                <p class="card-text">${obj.description}</p>
            </div>
            <!-- Botón con ícono de corazón -->
            <button type="button" class="btn btn-outline-danger position-absolute top-0 end-0 m-2">
                <i class="bi bi-heart"></i>
            </button>
            <div class="d-flex justify-content-around mb-5">
                <p>${obj.author.username}</p>
                <p>${obj.prep_time}</p>
                <a href="../recipes/single_recipe.html?id=${obj._id}" class="btn btn-dark">More Info</a>
            </div>
        </div>
    </div>`;
        return html;
    }
    
}

document.querySelector('#filterBtn').addEventListener('click', readFilterValues);

async function readFilterValues() {

    let resp = await fetch('/api/users/search/me',{
        method :'GET'
    })

    console.log(resp.status);
    let data = await resp.json()

    console.log(data);

    let selectedArray = document.querySelector('#Arrayselect').value;
    let selectedCategory = document.querySelector('#categorySelect').value;
    // let minPrice = document.querySelector('#minPrice').value;
    // let maxPrice = document.querySelector('#maxPrice').value;

    console.log('Selected array:', selectedArray);
    console.log('Selected category:', selectedCategory);
    // console.log('Minimum Price:', minPrice);
    // console.log('Maximum Price:', maxPrice);

    let recipelist = recipes_toShow.slice();

    if(selectedArray == "all")
    {
        //We will search in all the recipes
        recipelist = recipelist;
    }
    else if(selectedArray == "mine"){
        recipelist = recipelist.filter(recipe => recipe.author.username == data.username);
    }else if(selectedArray == "favorites"){
        //we will search in my favorites
        recipelist = recipelist.filter(obj1 => data.favorites.some(obj2 => obj1._id == obj2._id));
    }

    if(selectedCategory != "0")
    {
        recipelist = recipelist.filter(objeto =>
            objeto.categories.some(categoria => categoria.name == selectedCategory)
        );
    }

    // if(minPrice){
    //     prodlist = prodlist.filter(e=> e.pricePerUnit >= minPrice);
    // }

    // if(maxPrice)
    // {
    //     prodlist = prodlist.filter(e=> e.pricePerUnit <= maxPrice)
    // }

    console.log(recipelist);

    //showUsersTable(prodlist);
    pagination(1,recipelist,View.toHtmlList);


    // let pages=document.querySelector('#pagination');
    // pages.style.display = 'none';
}

function showUsersTable(prodlist)
{
    DataManager.pagination(1,prodlist,View.toHtmlTable, 1000);
}