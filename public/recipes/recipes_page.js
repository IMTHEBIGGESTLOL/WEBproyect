// Mock de categorías (puedes reemplazarlo con datos de tu base de datos)
let categories = [];

document.addEventListener("DOMContentLoaded", function() {
    loadCategories();
    console.log(categories)
});

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

    renderCategoryDropdown()
}


// Obtener referencia al formulario
var recipeForm = document.getElementById("recipeForm");
var selectedCategories = [];

function renderCategoryDropdown() {
    var categoryDropdownMenu = document.getElementById("categoryDropdownMenu");
    categoryDropdownMenu.innerHTML = ""; // Limpiar el dropdown antes de renderizar las categorías

    categories.forEach(function(category) {
        var option = document.createElement("li");
        option.classList.add("dropdown-item");
        option.innerHTML = category.name;
        option.setAttribute("data-id", category._id);
        categoryDropdownMenu.appendChild(option);
    });
}
// Manejar clic en una categoría
categoryDropdownMenu.addEventListener("click", function(event) {
    if (event.target.classList.contains("dropdown-item")) {
        var categoryId = event.target.getAttribute("data-id");
        var categoryName = event.target.innerHTML;
        addCategory(categoryId, categoryName);
    }
});

// Agregar categoría seleccionada
function addCategory(id, name) {
    // Verificar si la categoría ya está seleccionada
    var exists = selectedCategories.find(function(category) {
        return category.id === id;
    });

    if (!exists) {
        selectedCategories.push({ id: id, name: name });

        // Mostrar la categoría seleccionada
        renderSelectedCategories();

        // Limpiar dropdown
        document.getElementById("categoryDropdownMenuButton").innerHTML = "Seleccionar Categorías";
    }
}

// Renderizar las categorías seleccionadas
function renderSelectedCategories() {
    var selectedCategoriesContainer = document.getElementById("selectedCategories");
    selectedCategoriesContainer.innerHTML = "";

    selectedCategories.forEach(function(category) {
        var selectedCategory = document.createElement("div");
        selectedCategory.classList.add("alert", "alert-primary", "alert-dismissible", "fade", "show");
        selectedCategory.innerHTML = `
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="removeCategory(${category.id})"></button>
            ${category.name}
        `;
        selectedCategoriesContainer.appendChild(selectedCategory);
    });
}

// Eliminar categoría seleccionada
function removeCategory(id) {
    selectedCategories = selectedCategories.filter(function(category) {
        return category.id !== id;
    });

    // Volver a renderizar las categorías seleccionadas
    renderSelectedCategories();
}

// Manejar el envío del formulario
recipeForm.addEventListener("submit", async function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe por defecto

    // Obtener los datos del formulario
    var formData = new FormData(recipeForm);

    // Crear un objeto con los datos de la receta
    var recipeData = {};
    formData.forEach(function(value, key){
        recipeData[key] = value;
    });

    // Convertir ingredientes y pasos en arrays
    recipeData.ingredients = recipeData.ingredients.split('\n').map(function(line) {
        var parts = line.split(':');
        return { name: parts[0].trim(), quantity: parts[1].trim() };
    });
    recipeData.steps = recipeData.steps.split('\n').map(function(step) {
        return step.trim();
    });

    // Agregar categorías a los datos de la receta
    recipeData.categories = selectedCategories.map(function(category) {
        return category.id;
    });

    // Enviar los datos a la API o realizar otras acciones según sea necesario
    console.log("Datos de la receta:", recipeData);

    let resp = await fetch('/api/recipes',{
        method :'POST',
        headers:{
            'content-type': 'Application/json'
        },
        body: JSON.stringify(recipeData)
    })

    console.log(resp.status);
    let data = await resp.json()
    //console.log(data);

   if(data.error)
   {
        Swal.fire("Error", data.error , "error");
        return;
   }

    // Cerrar el modal
    var modal = bootstrap.Modal.getInstance(document.getElementById("recipeModal"));
    modal.hide();
});
