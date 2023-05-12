import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { generateToken, isAuth, isAdmin} from '../Utils.js'
import User from '../Models/UserModel.js';

const userRouter = express.Router();


userRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const users = await User.find({});
      res.send(users);
    })
  );
  
  userRouter.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );



  userRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id);
      if (user) {
        user.Name = req.body.Name || user.Name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.send({ message: 'User Updated', user: updatedUser });
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );
  
  userRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        if (user.email === 'admin@example.com') {
          res.status(400).send({ message: 'Can Not Delete Admin User' });
          return;
        }
        await user.removeAllListeners();
        res.send({ message: 'User Deleted' });
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );

userRouter.post(

    '/signin',
    expressAsyncHandler(async (req, res)=> {
        const user = await User.findOne({email:req.body.email});
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id:user._id,
                    Name:user.Name,
                    email:user.email,
                    isAdmin:user.isAdmin,
                    token:generateToken(user)
                });
                return;

            }
            

        }
        res.status(401).send({message:'Invalid email or password'});


    })
);

userRouter.post(
    '/signup',
    expressAsyncHandler(async(req, res) => {
        const newUser = new User({
            Name: req.body.Name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        });
        const user = await newUser.save();
        res.send({
            _id:user._id,
            Name:user.Name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user)
        });
    }));


    userRouter.put(

        '/profile',
        isAuth,
        expressAsyncHandler(async (req, res)=> {
            const user = await User.findById(req.user._id);
            if (user){
                user.Name=req.body.Name || user.Name;
                user.email=req.body.email || user.email;
                if(req.password) {
                    user.password = bcrypt.hashSync(req.body.password, 8);
                }
                const updateUser = await user.save();
                res.send({
                    _id:updateUser._id,
                    _Name:updateUser.Name,
                    email:updateUser.email,
                    isAdmin:updateUser.isAdmin,
                    token: generateToken(updateUser),
                 });
               }else{
                res.status(404).send({message:'User not Found'})
               }


             })
            );

            userRouter.post(
                '/forget-password',
                expressAsyncHandler(async (req, res) => {
                  const user = await User.findOne({ email: req.body.email });
              
                  if (user) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                      expiresIn: '3h',
                    });
                    user.resetToken = token;
                    await user.save();
              
                    //reset link
                    console.log(`${baseUrl()}/reset-password/${token}`);
              
                    mailgun()
                      .messages()
                      .send(
                        {
                          from: 'Amazona <me@mg.yourdomain.com>',
                          to: `${user.Name} <${user.email}>`,
                          subject: `Reset Password`,
                          html: ` 
                           <p>Please Click the following link to reset your password:</p> 
                           <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
                           `,
                        },
                        (error, body) => {
                          console.log(error);
                          console.log(body);
                        }
                      );
                    res.send({ message: 'We sent reset password link to your email.' });
                  } else {
                    res.status(404).send({ message: 'User not found' });
                  }
                })
              );
              
              userRouter.post(
                '/reset-password',
                expressAsyncHandler(async (req, res) => {
                  jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
                    if (err) {
                      res.status(401).send({ message: 'Invalid Token' });
                    } else {
                      const user = await User.findOne({ resetToken: req.body.token });
                      if (user) {
                        if (req.body.password) {
                          user.password = bcrypt.hashSync(req.body.password, 8);
                          await user.save();
                          res.send({
                            message: 'Password reseted successfully',
                          });
                        }
                      } else {
                        res.status(404).send({ message: 'User not found' });
                      }
                    }
                  });
                })
              );
              

export default userRouter;