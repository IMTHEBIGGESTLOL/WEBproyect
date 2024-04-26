// Función para obtener el parámetro de la URL por su nombre
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


document.addEventListener("DOMContentLoaded", function() {
    // Obtener el ID de la receta de la URL
    var recipeId = getParameterByName('id');
    loadRecipe(recipeId);
});

async function loadRecipe(recipeId)
{
    let resp = await fetch('/api/recipes/'+recipeId,{
        method :'GET',
        headers: {
            'x-auth': 23423
        }
    })

    console.log(resp.status);
    let data = await resp.json()

    console.log(data);

    let html = renderRecipe(data);
    render(html, "recipe");
}

function renderRecipe(obj){

    let ingredientsHtml = '';
    obj.ingredients.forEach((ingredient, index) => {
        ingredientsHtml += `<li><span>${ingredient}</span></li>`;
    });

    let instructionsHtml = '';
    obj.steps.forEach((instruction, index) => {
        instructionsHtml += `<div class="item">
                                <div class="num">${index + 1}.</div>
                                <p><span>${instruction}</span></p>
                            </div>`;
    });

    let html = `
                <div class="recipe-img">
                    <img src="${obj.photo}" alt="">
                </div>

                <div class="recipe-info">
                    <h1>${obj.title}</h1>
                    <h2>${obj.author.username}</h2>
                    <h3>${obj.creation_date}</h3>
                    <p class="description">${obj.description}</p>
  
                    <div class="recipe-prep-time">
                        <h3>Preparation and Cook time</h3>
                        <ul>
                            <li><span>Total</span>: Approx  ${obj.prep_time + obj.cook_time}</li>
                            <li><span>Preparation</span>: ${obj.prep_time}</li>
                            <li><span>Cooking</span>: ${obj.cook_time}</li>
                        </ul>
                    </div>

                    <div class="recipe-step">
                        <h2>Ingredients</h2>
                        <ul class="ingredients">
                            ${ingredientsHtml}
                        </ul>
                    </div>

                    <hr>

                    <div class="recipe-step">
                        <h2>Instructions</h2>
                        <div class="instructions">
                            ${instructionsHtml}
                        </div>
                    </div>

                    <hr>

                    <div class="chat-area">
                        <p>chat will be here</p>
                    </div>

                </div>
    `;

    return html;
}

function render(html, elementId){
    document.querySelector(`#${elementId}`).innerHTML = html;
}

function goBack() {
    window.history.back();
}