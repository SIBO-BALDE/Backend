import express from 'express';
import Product from '../Models/ProductModel.js';
import  expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../Utils.js';
import { isAdmin } from '../Utils.js';




const productRouter = express.Router();


productRouter.get('/', async (req,res)=>{
    const products=await Product.find();
    res.send(products);
});


productRouter.post(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const newProduct = new Product({
        Name: 'sample Name ' + Date.now(),
        slug: 'sample-Name' + Date.now(),
        Image: '/Images/chapeauu.png',
        prix: 0,
        category: 'sample category',
        brand: 'sample brand',
        countInStock: 0,
        rating: 0,
        numReviews: 0,
        description: 'sample description',
      });
      const product = await newProduct.save();
      res.send({ message: 'Product Created', product });
    })
  );



  productRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product) {
        product.Name = req.body.Name;
        product.slug = req.body.slug;
        product.prix = req.body.prix;
        product.Image = req.body.Image;
        product.Images = req.body.Images;
        product.category = req.body.category;
        product.brand = req.body.brand;
        product.countInStock = req.body.countInStock;
        product.description = req.body.description;
        await product.save();
        res.send({ message: 'Product Updated' });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );
  
  productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (product) {
        await product.removeAllListeners();
        res.send({ message: 'Product Deleted' });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );
  
  productRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product) {
        if (product.reviews.find((x) => x.Name === req.user.Name)) {
          return res
            .status(400)
            .send({ message: 'You already submitted a review' });
        }
  
        const review = {
          Name: req.user.Name,
          rating: Number(req.body.rating),
          comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((a, c) => c.rating + a, 0) /
          product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
          message: 'Review Created',
          review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
          numReviews: product.numReviews,
          rating: product.rating,
        });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );


  
  const PAGE_SIZE = 3;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);
  
const PAZE_SIZE = 3;
productRouter.get(
    '/search', 
    expressAsyncHandler( async (req,res)=>{
        const {query} = req;
        const pageSize = query.pageSize || PAZE_SIZE;
        const page = query.page || 1;
        const category = query.category || '';
        const brand = query.brand || '';
        const prix = query.prix || '';
        const rating = query.rating || '';
        const order = query.order || '';
        const searchQuery = query.query || '';

        const queryFilter =
        searchQuery && searchQuery !== 'all'
        ? {
            Name:  {
                $regex: searchQuery,
                $options:'i'
            },
        }
        :{};
        const categoryFilter = category && category !== 'all' ? {category} :{};
        

        const ratingFilter =
        rating && rating !== 'all'
        ? {
            rating:  {
                $gte: Number(rating),
                
            },
        }
        :{};
        const prixFilter =
        prix && prix !== 'all'
        ? {
            prix:  {
                $gte: Number(prix.split('-')[0]),
                $lte: Number(prix.split('-')[1]),
                
            },
        }
        :{};
        const sortOrder = 
        order === 'featured'
        ? {featured: -1}
        : order === 'lowest'
        ? {prix: 1}
        : order === 'highest'
        ? {prix: -1}
        : order === 'toprated'
        ? {rating: -1}
        : order === 'newest'
        ? {createdAt: -1}
        : {_id:-1};

        const products=await Product.find({
          
            ...queryFilter,
            ...categoryFilter,
            ...prixFilter,
            ...ratingFilter,  
        })
        
        //La méthode sort() trie les éléments
        // d'un tableau, dans ce même tableau, et renvoie le tableau. Par défaut, le tri s'effectue sur les éléments du tableau convertis en chaînes de caractères et triées selon les valeurs des unités de code UTF-16 des caractères
        .sort(sortOrder)
        .skip(pageSize * (page -1))
        .limit(pageSize);
        //Count product
        const countProducts=await Product.countDocuments({
            ...queryFilter,
            ...categoryFilter,
            ...prixFilter,
            ...ratingFilter,
        });
        console.log(countProducts, 'backend-countProducts')
        
       
        res.send({
            products,
            countProducts,
            page,
            // la methode math.ceil permet d'arrondire suppérieurement
            pages:Math.ceil(countProducts / pageSize),
        });
})

);




productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
      const categories = await Product.find().distinct('category');
      res.send(categories);
    })
  );

// Copie de l'api pour aficher les details de l'api si on clik sur le produit
productRouter.get('/slug/:slug', async(req, res) => {
    const product = await Product.findOne({slug:req.params.slug});
    if(product) {
        res.send(product);
    }
    else {
        res.status(400).send({message: 'Product Not Found'})
    }

    
});



// Copie de l'api pour aficher les details de l'api si on clik sur le produit
productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        res.send(product);
    }
    else {
        res.status(400).send({message: 'Product Not Found'})
    }

    
});
 
export default productRouter;