let categories = []


class categoryManager
{
    static async loadData(){
    
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


        
    }

    static toHtml()
    {
        let html = ViewCategory.toHtmlList(categories);
        ViewCategory.render(html, "tags-list");
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
        let html = `<a href="">${obj.name}</a>`;
        return html;
        
    }
}