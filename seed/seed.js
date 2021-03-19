const mongoose = require("mongoose");

// sakonektēt mongoose ar lokālo datubāzi yelp-camp (ja tādas nav, tad tāda tiek izveidota), vēlāk ar production datubāzi
mongoose.connect("mongodb://localhost:27017/blogzz", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
// db datubāzes reference, un error handlings + info par sekmīgu piekonektēšanos
// palaižot aplikāciju caur node - izies cauri šim connection un parādīs attiecīgu msg
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})


const Blog = require("../models/blog"); // modelis
const {blogs} = require("./blogs"); // blog data


async function addBlog() {
    await Blog.deleteMany({});
    // for(let i = 0; i < blogs.length; i++) {
    //     let blog = blogs[i];
    //     // console.log(blog)
    //     const newBlog = new Blog({
    //         categorie: blog.categorie,
    //         title: blog.title,
    //         text: blog.text,
    //         rating: blog.rating,
    //         author: blog.author,
    //         date: blog.date,
    //         author: "60545fd98c41a62844f272e1"
    //     })
    //     await newBlog.save();
    // }
}

// async funkcija, tapēc atgriež promisu, par cik šī ir tikai seeds datu darbība, connection varam noslēgt
addBlog()
.then(() => {
    console.log("Database closed for seed operations")
    mongoose.connection.close();
})



































// module.exports.blogs =  [
//     {
//         id: 1,
//         categorie: "politics",
//         author: "mart8ins",
//         title: "Besī tā viņķele ar savām vakcīnām!",
//         date: "17.03.2021",
//         text: "Stingrāki drošības pasākumi tiek ieviesti arī izglītības jomā. Klātienē mācību process drīkst notikt tikai bērnudārzos un 1.-4. klasēs. Skolās jānodrošina trīs kvadrātmetru platība vienam skolēnam. No 3. decembra bērnudārzos strādājošajiem visu laiku jānēsā maskas. No 4. janvāra skolās maskas jānēsā gan stundu laikā, gan ārpus mācību procesa gan skolēniem, gan skolotājiem.",
//         comments: [
//          {
//             id: 1,
//             author: "Aiga",
//             text: "Piekrītu, man arī viņa besī!"
//         }
//         ],
//         rating: 3

//     },
//     {
//         id: 2,
//         categorie: "sports",
//         author: "Kaža",
//         title: "Spēle bija tik laba!",
//         date: "18.03.2021",
//         text: "Klātienē mācību process drīkst notikt tikai bērnudārzos un 1.-4. klasēs. Skolās jānodrošina trīs kvadrātmetru platība vienam skolēnam. No 3. decembra bērnudārzos strādājošajiem visu laiku jānēsā maskas. No 4. janvāra skolās maskas jānēsā gan stundu laikā, gan ārpus mācību procesa gan skolēniem, gan skolotājiem.",
//         comments: [
//          {
//             id: 2,
//             author: "Toms",
//             text: "Bet pendeli tak neiesita un zaudēja"
//         }
//         ],
//         rating: 1

//     },
//     {
//         id: 3,
//         categorie: "sports",
//         author: "Miks",
//         title: "Bet tomēr zaudēja",
//         date: "19.03.2021",
//         text: "Porziņģis labi spēlē. Klātienē mācību process drīkst notikt tikai bērnudārzos un 1.-4. klasēs. Skolās jānodrošina trīs kvadrātmetru platība vienam skolēnam. No 3. decembra bērnudārzos strādājošajiem visu laiku jānēsā maskas. No 4. janvāra skolās maskas jānēsā gan stundu laikā, gan ārpus mācību procesa gan skolēniem, gan skolotājiem.",
//         comments: [
//          {
//             id: 3,
//             author: "Toms",
//             text: "Bet pendeli tak neiesita un zaudēja"
//         },
//         {
//             id: 4,
//             author: "Uldis",
//             text: "Man ir pielnīgi vienalga par šo spēli."
//         }
//         ],
//         rating: 5

//     },
//     {
//         id: 3,
//         categorie: "auto",
//         author: "Ingus",
//         title: "Jaunais Porš ir cool!",
//         date: "19.03.2021",
//         text: "Laba mašīna. Daudz jaudas. a trīs kvadrātmetru platība vienam skolēnam. No 3. decembra bērnudārzos strādājošajiem visu laiku jānēsā maskas. No 4. janvāra skolās maskas jānēsā gan stundu laikā, gan ārpus mācību procesa gan skolēniem, gan skolotājiem.",
//         comments: [
//          {
//             id: 5,
//             author: "Toms",
//             text: "Bet pendeli tak neiesita un zaudēja"
//         },
//         {
//             id: 6,
//             author: "Uldis",
//             text: "Man ir pielnīgi vienalga par šo spēli."
//         }
//         ],
//         rating: 0

//     }
// ]

// module.exports.comments = [
//     {
//         id: 1,
//         date: "10.02.2021",
//         author: "Aiga",
//         text: "Piekrītu, man arī viņa besī!",
//         blog: "Besī tā viņķele ar savām vakcīnām!"
//     },
//     {
//         id: 2,
//         date: "10.04.2021",
//         author: "Toms",
//         text: "Bet pendeli tak neiesita un zaudēja",
//         blog: "Bet tomēr zaudēja"
//     },
//     {
//         id: 3,
//         date: "10.02.2019",
//         author: "Toms",
//         text: "Bet pendeli tak neiesita un zaudēja",
//         blog: "Besī tā viņķele ar savām vakcīnām!"
//     },
//     {
//         id: 4,
//         date: "10.01.2021",
//         author: "Uldis",
//         text: "Man ir pielnīgi vienalga par šo spēli.",
//         blog: "Spēle bija tik laba!"
//     },
//     {
//         id: 5,
//         date: "12.02.2021",
//         author: "Toms",
//         text: "Bet super super super lab gaja!",
//         blog: "Besī tā viņķele ar savām vakcīnām!"
//     },
//     {
//         id: 6,
//         date: "15.02.2021",
//         author: "Uldis",
//         text: "Man vairs nav vienalga",
//         blog: "Jaunais Porš ir cool!"
//     }
// ]