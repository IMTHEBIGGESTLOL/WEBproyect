let recipesArray = []
let categories = []
let latest_recipes = []
let newest_recipe;

let actualPage;
let pageSize = 5;

class DataManager
{

    static pruebaID(_id)
    {
        console.log(_id);
    }

    static async loadData(category = null){
    
        console.log(category);
        let resp = await fetch('/api/recipes',{
            method :'GET',
            headers: {
                'x-auth': 23423
            }
        })
    
        console.log(resp.status);
        let data = await resp.json()

        console.log(data);
        
        recipesArray = data.recipes;

        newest_recipe = recipesArray[0];

        recipesArray.shift();

        let html = this.toHtml(View.toHtmlList,recipesArray);
        View.render(html, "card_recipes");

        let resp_cat = await fetch('/api/categories',{
            method :'GET',
            headers: {
                'x-auth': 23423
            }
        })
    
        console.log(resp_cat.status);
        let cat = await resp_cat.json()
        
        categories = cat.categories;

        let cat_html = this.toHtml(ViewCategory.toHtmlList,categories);
        View.render(cat_html, "categories");

        let resp_recipes_bottom = await fetch('/api/recipes' + '?skip=5&limit=4',{
            method :'GET',
            headers: {
                'x-auth': 23423
            }
        })
    
        console.log(resp.status);
        let data_recipes = await resp_recipes_bottom.json()
        
        latest_recipes = data_recipes.recipes;

        let html_recipes = this.toHtml(View.toHtmlList,latest_recipes);
        View.render(html_recipes, "try-cards");

        let newest_html = this.rendernewest(newest_recipe);
        View.render(newest_html, "newest");

        // if(category == null)
        // {
        //     this.pagination(actualPage);
        // }else{
        //     this.filterProducts(category);
        // }
  
    }

    static rendernewest(obj)
    {
        let creationDate = new Date(obj.creation_date);

        // Format the date as a string
        let formattedCreationDate = creationDate.toLocaleString();
        let html = `
                    <div class="container row" style=" background: url(${obj.photo}) var(--cl-4--);
                    background-repeat: no-repeat;
                    background-position: right center;
                    background-size: contain;
                    overflow: hidden;
                    border-radius: 50px 0px 0px 50px;">
                    <div class="hero-content">
                    <div class="content">
                        
                        <div class="recipe row">
                            <img src="${obj.photo}" alt="">
                                HOT recipes
                        </div>
                        <h1>${obj.title}</h1>
                        <p>${obj.description}</p>
                        <div class="time row">
                            <div class="row">
                                <p><i class="bi bi-alarm-fill"></i> ${obj.prep_time} minutes</p>
                            </div>
                            <div class="row">
                                <p><i class="fa-solid fa-drumstick-bite"></i> Chicken</p>
                            </div>
                        </div>
                        <div class="profile-btn row">
                            <div class="profile row">
                                <div class="p-img row">
                                    <img src="${obj.author.userPhoto}" alt="">
                                </div>
                                <div class="column">
                                    <h6>${obj.author.username}</h6>
                                    <p>${formattedCreationDate}</p>
                                </div>
                            </div>
                            <a href="#" class="hero-btn row">
                                View Recipes
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    </div>
                    </div>
        `;

        return html;
    }

    static filterProducts(category)
    {
        recipesArray = recipesArray.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));

        this.pagination(actualPage,prodlist_cat);
    }

    static pagination(page, prodlist = recipesArray, fnToHtml = View.toHtmlList, pagesize = pageSize) {
        
        sessionStorage.setItem("page", page);
        actualPage = page;
    
        // Calcula el índice inicial y final de los productos a mostrar en la página
        let startIndex = (page - 1) * pagesize;
        let endIndex = startIndex + pagesize;
        
        // Filtra los productos para mostrar solo los de la página actual
        let productsToShow = prodlist.slice(startIndex, endIndex);
    
        console.log(productsToShow);

        this.pageLogic(prodlist,pageSize);
    
        // Renderiza los productos de la página actual
        let html = this.toHtml(fnToHtml,productsToShow);
        View.render(html, "card_recipes");
    }

    static toHtml(fnToHtml = View.toHtmlList, prodlist) {
        console.log("entro");
        return fnToHtml(prodlist);
    }

    static pageLogic(prodList, pageSize)
    {
        const totalPages = Math.ceil(prodList.length / pageSize);

        console.log(prodList);

        let paginationHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            let encodedProdList = encodeURIComponent(JSON.stringify(prodList));
            if (i === parseInt(sessionStorage.getItem("page"))) {
                paginationHTML += `<li class="page-item active"><a class="page-link" href="#" onclick="DataManager.pagination(${i}, JSON.parse(decodeURIComponent('${encodedProdList}')))">${i}</a></li>`;
            } else {
                paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="DataManager.pagination(${i}, JSON.parse(decodeURIComponent('${encodedProdList}')))">${i}</a></li>`;
            }
        }


        document.getElementById('pagination').innerHTML = paginationHTML;

        if (totalPages === 0) {
            document.getElementById('pagination').style.display = 'none';
        } else {
            document.getElementById('pagination').style.display = 'flex';
        }
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
                    <a href="./recipes/single_recipe.html?id=${obj._id}" class="card">
                        <img src="${obj.photo}" alt="">
                        <h5>${obj.title}</h5>
                        <div class="time row">
                            <div class="row">
                                <p><i class="bi bi-alarm-fill"></i> ${obj.prep_time}</p>
                            </div>
                            <div class="row">
                                <p><i class="fa-solid fa-drumstick-bite"></i> ${obj.author.username}</p>
                            </div>
                        </div>
                        <div class="like row active">
                            <i class="bi bi-heart"></i>
                        </div>
                    </a>`;
        return html;
    }

    static toHtmlTable(list, propOrder){
        let html = `<table> 
                        <tr> 
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>unit</th>
                            <th>image</th>
                            <th>Actions</th>
                        </tr>
                    
                    ${list.map((prod) => View.toHtmlRow(prod)).join("")}
                    </table>
                    `;
        return html;
    }

    static toHtmlRow(obj, propOrder = []) {
        if (propOrder.length === 0) {
            propOrder = ['uuid', 'name', 'description', 'pricePerUnit', 'stock', 'category', 'unit', 'imageUrl'];
        }
        let html = '<tr>';
        for (const prop of propOrder) {
            if(prop =="imageUrl"){
                html+=`<td><img src="${obj[prop]}" alt="" style="width: 50px;"></td>`
            }else
            html+=`<td>${obj[prop]}</td>`
        }
        html += `<td>
                    <a
                        class="btn btn-primary"
                        href="#"
                        role="button"
                        onclick = "editProduct('${obj.uuid}')"
                        ><i class="bi bi-pencil-fill"></i>
                    </a>
                </td>`
        html += '</tr>';
        return html;
    }
    
}

class ViewCategory
{

    static render(html, elementId){
        document.querySelector(`#${elementId}`).innerHTML = html;
    }

    static toHtmlList(list){
        console.log("entro2");
        let html = `
                    ${list.map((prod) => ViewCategory.toHtmlDiv(prod)).join("")}
                
                    `;
        return html;
    }
    
    static toHtmlDiv(obj) {
        console.log("entro3");
        let html = `<a href="#" class="cat-card">
                        <img src="${obj.photo}" alt="">
                        <h6>${obj.name}</h6>
                    </a>`;
        return html;
        
    }
}