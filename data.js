//imported from react bcryptjs to crypte password
import bcrypt from 'bcryptjs'
const data={
  //Create users
  users:[
    {
      Name:'SIBO',
      email:'admin@example.com',
      password:bcrypt.hashSync('123456'),
      isAdmin:true,

    },
    {
      Name:'mary',
      email:'user@example.com',
      password:bcrypt.hashSync('123456'),
      isAdmin:false,
    },

  ],
    products:[
      {
        // _id:'1',
        Name:'CHAPEAU',
        slug:'chapeau',
        prix:25000,
        category:'Accéssoires personnels et deco interieur',
        Image:'/Images/chapeauu.png',
        countInStock:20,
        brand:'la loincloth',
        rating:4.5,
        numReviews:40,
        description:'high quality',
            } , 
            {
        //  _id:'2',
          Name:'LINGUERE',
          slug:'linguere',
          prix:5000,
          category:'Accéssoires femmes et deco inteieur ',
          Image:'/Images/bracelets.png',
          countInStock:9,
          brand:'la loincloth',
          rating:2.5,
          numReviews:9,
          description:'high quality',
            } ,
            {
        //  _id:'3',
          Name:'YODI',
          slug:'yodi',
          prix:25000,
          category:'Children cloth',
          Image:'/Images/petit.png',
          countInStock:0,
          brand:'la loincloth',
          rating:3.5,
          numReviews:10,
          description:'high quality',
            },
            
     
      {
      // _id:'4',
        Name:'MOOTOU',
        slug:'mootou',
        prix:20000,
        category:'Accéssoires personnels et deco interieur',
        Image:'/Images/pochette.png',
        countInStock:30,
        brand:'la loincloth',
        rating:3.5,
        numReviews:21,
        description:'high quality',
      } , 
        {
        // _id:'5',
        Name:'SAKI',
        slug:'saki',
        prix:5000,
        category:'Women cloth',
        Image:'/Images/short.png',
        countInStock:78,
        brand:'la loincloth',
        rating:3.5,
        numReviews:28,
        description:'high quality',
      } , 

      {
      // _id:'6', 
       Name:'MAMA',
       slug:'mama',
       prix:50000,
       category:'men cloth',
       Image:'/Images/boubou.png',
       countInStock:16,
       brand:'la loincloth',
       rating:4.5,
       numReviews:50,
       description:'high quality',  
      },
      
      
      {
      //  _id:'7',
        Name:'FEWNDE',
        slug:'fewnde',
        prix:10000,
        category:'Accéssoires personnels et deco interieur',
        Image:'/Images/montre.png',
        countInStock:17,
        brand:'la loincloth',
        rating:2.5,
        numReviews:21,
        description:'high quality',
      } ,  
  
      {
      // _id:'8',
        Name:'DIOMGALE',
        slug:'diomgale',
        prix:30000,
        category:'men cloth',
        Image:'/Images/chic.png',
        countInStock:13,
        brand:'la loincloth',
        rating:3.5,
        numReviews:21,
        description:'high quality',
      } , 
     
      
      {
      // _id:'9',
        Name:'YONTA',
        slug:'yonta',
        prix:15000,
        category:'children cloth',
        Image:'/Images/large.png',
        countInStock:30,
        brand:'la loincloth',
        rating:2.5,
        numReviews:30,
        description:'high quality',
      } , 
      {
      // _id:'10',
        Name:'HABILLAGES',
        slug:'habillages',
        prix:15000,
        category:'women cloth',
        Image:'/Images/habillages.png',
        countInStock:13,
        brand:'la loincloth',
        rating:1.5,
        numReviews:19,
        description:'high quality',
          } , 
           
      {
      // _id:'11',
        Name:'DILLI',
        slug:'dilli',
        prix:25000,
        category:'women cloth',
        Image:'/Images/chemise.png',
        countInStock:0,
        brand:'la loincloth',
        rating:3.5,
        numReviews:21,
        description:'high quality',
      } , 
    
     
          {
    //  _id:'12',
      Name:'COLIER',
      slug:'colier',
      prix:30000,
      category:'Accéssoires personnels et deco interieur',
      Image:'/Images/boucle.png',
      countInStock:20,
      brand:'la loincloth',
      rating:5.5,
      numReviews:40,
      description:'high quality',
          } , 
    
     
    

    ],
};
export default data;
