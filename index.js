document.addEventListener("DOMContentLoaded", function(){
    const user_modal = document.getElementById("user-modal")
    const open_modal = document.getElementById("open-modal")
    const result = document.getElementById("result")
    let form = {}
    let isEditMode = false; // Yangilash yoki yangi ma'lumot qo'shish rejimini aniqlash uchun
    let editProductId = null; // Tahrirlanayotgan mahsulot ID-si
    const save = document.getElementById("save")
    const close_modal = document.getElementById("close-modal")
    let baseUrl = "http://localhost:3000/products"
    let products = []

    const inputs = document.querySelectorAll('input')

    open_modal.addEventListener('click', () => {
        openModal();
        resetForm(); // Yangi mahsulot qo'shilayotganda eski ma'lumotlarni tozalash
    });

    save.addEventListener("click", saveProduct)
    close_modal.addEventListener('click', () => toggleModal("none"))
    getProduct()

    inputs.forEach(input => {
        input.addEventListener('input', handleChange);
    });

    window.addEventListener("click", function(event){
        if (event.target === user_modal) {
            toggleModal("none")
        }
    })

    function openModal (){
        toggleModal("block")
    }

    function toggleModal (status){
        user_modal.style.display = status
    }

    async function saveProduct() {
        try {
            let method = isEditMode ? "PUT" : "POST"; // Rejimga qarab POST yoki PUT
            let url = isEditMode ? `${baseUrl}/${editProductId}` : baseUrl;

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            if (response.ok) {
                form = {} 
                document.querySelectorAll('input').forEach(input => input.value = ""); 
                toggleModal("none")
                getProduct()
                resetForm();
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    
    function resetForm() {
        form = {};
        editProductId = null;
        isEditMode = false;
        document.querySelectorAll('input').forEach(input => input.value = ""); 
    }

    function handleChange (event){
        const {name, value} = event.target
        form = {...form, [name]: value}
    }

    async function getProduct(){
        try {   
            const response = await fetch(`${baseUrl}`)
            products = await response.json()
            displayProduct()
        } catch (error) {
            console.log("error", error);
        }
    }

    function displayProduct() {
        result.innerHTML = ""
        products.forEach((item, index) => {
            let tr = document.createElement("tr")
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.color}</td>
                <td>${item.brand}</td>
                <td>
                    <button class="btn btn-warning mx-1">edit</button>
                    <button class="btn btn-danger mx-1">delete</button>
                </td>
            `

            const editButton = tr.querySelector(".btn-warning");
            const deleteButton = tr.querySelector(".btn-danger");

            editButton.addEventListener('click', () => editProduct(item));
            deleteButton.addEventListener('click', () => deleteProduct(item.id));
    
            result.appendChild(tr)
        })
    }
    
    function editProduct(item) {
        // Tahrirlash uchun modalni ochish va inputlarga ma'lumotlarni qo'yish
        openModal();
        isEditMode = true; 
        editProductId = item.id;

        // Input maydonlariga mahsulot ma'lumotlarini qo'shish
        document.querySelector('input[name="name"]').value = item.name;
        document.querySelector('input[name="price"]').value = item.price;
        document.querySelector('input[name="color"]').value = item.color;
        document.querySelector('input[name="brand"]').value = item.brand;

        // Forma obyektini to'ldirish
        form = {
            name: item.name,
            price: item.price,
            color: item.color,
            brand: item.brand
        };
    }
    
    async function deleteProduct(id) {
        try {
            await fetch(`${baseUrl}/${id}`, {
                method: "DELETE"
            })
            getProduct(); 
        } catch (error) {
            console.log("error", error);
        }
    }
})
