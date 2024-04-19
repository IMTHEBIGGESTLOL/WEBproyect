function agregarIngrediente() {
    const ingredientesTextArea = document.getElementById('ingredients');
    const nuevoIngrediente = prompt("Enter ingredient:");

    if (nuevoIngrediente) {
        ingredientesTextArea.value += nuevoIngrediente + '\n';
    }
}

// Función para enviar el formulario y crear una nueva receta
document.getElementById('recipeForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar que se envíe el formulario automáticamente

    // Obtener los valores de los campos del formulario
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const duracion = document.getElementById('duracion').value;
    const cooktime = document.getElementById('cooktime').value;
    const categoria = document.getElementById('categoryDropDown').value;
    const pasos = document.getElementById("pasos").value.split(",").filter(Boolean);
    const ingredientes = document.getElementById('ingredients').value.split(',').filter(Boolean); // Convertir el texto en un arreglo de ingredientes y eliminar elementos vacíos
    const herramientas = document.getElementById('tools').value.split(',').filter(Boolean); // Convertir el texto en un arreglo de herramientas y eliminar elementos vacíos

    // Crear el objeto de receta
    const receta = {
        titulo: titulo,
        descripcion: descripcion,
        duracion: parseInt(duracion),
        cooktime: parseInt(cooktime),
        categoria: categoria,
        pasos: pasos,
        ingredientes: ingredientes,
        herramientas: herramientas
    };

    // Aquí puedes hacer lo que desees con el objeto de receta, por ejemplo, enviarlo a una base de datos o mostrarlo en la consola
    console.log(receta);

    // Limpiar el formulario después de enviarlo
    this.reset();
});