import { Product } from "./models/Product";
import { DataError } from "./utils/errorHandler";
import * as api from "./services/apiService"

    
    
const main = async () => {

    console.log(await api.getProductsByCategory('laptops'))

    console.log(await api.getInventory())

    console.log(await api.getProductById(20))
    
    console.log(await api.getInventoryQty())
    
    console.log(await api.searchProduct("laptop"))
    
    console.log(await api.sortProducts({ limit: 0 }))
    
    console.log(await api.getAllCategories())

    console.log(await api.addProduct({ title: 'BMW Pencil', price: 5.6, discountPercentage: 10, category: 'school' }));

    console.log(await api.addProduct({ title: 'ASUS TUF F15', price: 980, discountPercentage: 15, category: 'laptop' }));

    console.log(await api.updateProduct(194,{title: "iPhone 16", price: 900, discountPercentage: 0, brand: "Apple"}));

    console.log(await api.deleteProduct(3));

}

main()