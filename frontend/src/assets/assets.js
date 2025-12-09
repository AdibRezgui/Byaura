import cover1 from './cover1.png'
import cover2 from './cover2.png'
import logo from './logo.png'
import search from './search.png'
import profil from './profile.png'
import cart from './cart.png'
import menu from './menu.png'
import down from './down.png'
import im1 from './im1.png'
import support from './support.png'
import Quality from './Quality.png'
import exchange from './exchange.png'
import im2 from './im2.png'
import im6 from './im6.png'
import im7 from './im7.png'
import im10 from './im10.png'
import im11 from './im11.png'
import im12 from './im12.png'
import cross from'./cross.png'
import star from './star.png'
import bin from './bin.png'
import aboutcover from './aboutcover.png'
import contactcover from './contactcover.png'

export const assets = {
    cover1,
    cover2,
    logo,
    search,
    profil,
    cart,
    menu,
    down,
    im1,
    im2,
    im6,
    im7,
    im10,
    im11,
    im12,
    support,
    Quality,
    exchange,
    cross,
    star,
    bin,
    aboutcover,
    contactcover,
}

export const products = [
    {
        _id: "aaaaa",
        name: "chemise blanche",
        description: "treés belle chemise blanche en coton",
        price: 220,
        image: [im1],
        category: "women",
        subCategory: "Shirts",
        sizes: ["XS","S","M","L","XL","XXL"],
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "chemise noir",
        price: 220,
        image: [im2],
        category: "women",
        subCategory: "Shirts",
        sizes: ["S","M","L"],
        bestseller: false
    },
    {
        _id: "aaabb",
        name: "robe noir",
        price: 290,
        image: [im6],
        category: "women",
        subCategory: "Dress",
        sizes: ["S","M","L"],
        bestseller: true
    },
    { _id: "aabbb",
        name: "chemise jean",
        price: 190,
        image: [im10,im11,im12],
        category: "women",
        subCategory: "Shirts",
        sizes: ["S","M","L"],
        bestseller: true},
]
