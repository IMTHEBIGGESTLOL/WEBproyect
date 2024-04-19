let recipesArray = []
let productsDisplayed = []

let actualPage;
let pageSize = 2;

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

        console.log(recipesArray);

        if(category == null)
        {
            this.pagination(actualPage);
        }else{
            this.filterProducts(category);
        }
  
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
        View.render(html, "recipes-list");
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
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${obj.photo}" class="card-img-top" alt="${obj.title}">
                    <div class="card-body">
                        <h5 class="card-title">${obj.title}</h5>
                        <p class="card-text">Prep: ${obj.prep_time} | Cook: ${obj.cook_time}</p>
                        <p class="card-text"><i class="bi bi-person"></i> ${obj.author.username}</p>
                        <a href="#" onclick="DataManager.pruebaID('${obj._id}')" class="btn btn-primary">View Recipe</a>
                        </div>
                </div>
            </div>`;
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