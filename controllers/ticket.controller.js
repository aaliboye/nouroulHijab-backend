const Ticket = require("../model/ticket.model");
const Produit = require("../model/produit.model");
const Vente = require("../model/vente.model");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");

module.exports = {
  //   listVentes: (req, res, next) => {
  //     Ticket.find()
  //       .then((tickets) => {
  //         res.status(200).json(tickets);
  //       })
  //       .catch((err) => {
  //         res.status(400).json({
  //           success: false,
  //           message: err,
  //         });
  //       });
  //   },
  listVentes: async (req, res, next) => {
    const ventes = await Vente.find().populate("user").exec();
    if (ventes) {
      res.status(200).json(ventes);
    } else {
      res.status(400).json({
        success: false,
        message: err,
      });
    }

    return;
  },

  //   listVenteToday: (req, res, next) => {
  //     Ticket.find({ createdAt: { $gt: Date.now() - 24 * 60 * 60 * 1000 } })
  //       .then((tickets) => {
  //         res.status(200).json(tickets);
  //       })
  //       .catch((err) => {
  //         res.status(400).json({
  //           success: false,
  //           message: err,
  //         });
  //       });
  //   },
  listVenteToday: (req, res, next) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate()
    console.log(new Date());
    console.log(currentDay);
    // Obtenez la date de début du mois actuel
    const startOfDay = new Date(currentYear, currentMonth, currentDay);
    console.log("startOfDay");
    console.log(startOfDay);

    // Obtenez la date de début du mois suivant
    const startOfNextDay = new Date(currentYear, currentMonth, currentDay+1);
    console.log(startOfNextDay);
    const ventes = Vente.find({ createdAt: { $gt: startOfDay, $lt: startOfNextDay } })
      .populate("user")
      .exec((err, ventes) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err,
          });
        }

        console.log(ventes);
        res.status(200).json(ventes);
      });

    // console.log(ventes);
    // if(ventes){
    //     res.status(200).json(ventes);
    // }
    // else{
    //     res.status(400).json({
    //                   success: false,
    //                   message: err,
    //                 });
    // }
  },

  listVenteMonth: (req, res, next) => {
    console.log("errr");
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Les mois commencent à partir de 0 dans JavaScript
    console.log(currentMonth);

    // Obtenez la date de début du mois actuel
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);

    // Obtenez la date de début du mois suivant
    const startOfNextMonth = new Date(currentYear, currentMonth, 1);
    console.log(startOfMonth);
    console.log(startOfNextMonth);
    Vente.find({
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    })
      .populate("user")
      .exec((err, data) => {
        if (err) {
          console.error(err);
          return res.status(400).json({
            success: false,
            message: err,
          });
          // Gérer l'erreur
        } else {
          console.log(data);
          return res.status(200).json(data);
          // Traitez les données récupérées
        }
      });
  },

  getVenteById: (req, res, next) => {
    const vente = Vente.findOne({ _id: req.params.idVente })
      .populate("user")
      .exec((err, vente) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err,
          });
        }

        console.log(vente);
        res.status(200).json(vente);
      });
  },

  validerPanier: (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "ASSANEALIKEY");
    const userId = decodedToken.userId;

    var listProduits = req.body.listProduits;
    var panier = new Vente({
      listProduits: null,
      user: userId,
      prixTotal: req.body.prix,
      createdAt: Date.now(),
      status: "initiated",
    });

    var promises = [];

    listProduits.forEach((vente) => {
      promises.push(
        Produit.findOne({ name: vente.productName }).then((produit) => {
          if (produit && produit.stock >= vente.quantite) {
            return Produit.updateOne(
              { name: vente.productName },
              { stock: produit.stock - vente.quantite }
            ).then((result) => {
              return vente;
            });
          }
        })
      );
    });

    Promise.all(promises)
      .then((listVentes) => {
        listVentes = listVentes.filter((vente) => vente); // Supprimer les valeurs undefined
        panier.listProduits = listVentes;
        console.log(panier);
        console.log(panier);
        panier
          .save()
          .then((result) => {
            panier.status = "success";
            panier.save().then((result) => {
              return res
                .status(200)
                .json({ success: true, message: "Vendu avec succes" });
            });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(400)
              .json({ success: false, message: "echec vente" });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  //   validerPanier: ( (req, res, next) => {
  //     const token = req.headers.authorization.split(" ")[1];
  //     const decodedToken = jwt.verify(token, "ASSANEALIKEY");
  //     const userId = decodedToken.userId;

  //     // console.log(req.body);

  //     var listProduits = req.body.listProduits;
  //     // console.log(listProduits.length);
  //     var panier = new Vente({
  //       listProduits: null,
  //       userId: userId,
  //       prixTotal: req.body.prix,
  //       // status: ''
  //     });

  //     // console.log(panier.listProduits.length);
  //     var listVentes = []

  //     listProduits.forEach((vente) => {
  //       Produit.findOne({ name: vente.productName })
  //         .then((produit) => {
  //           if (produit && produit.stock >= vente.quantite) {
  //             // console.log(vente);
  //             Produit.updateOne({name: vente.productName }, {stock: produit.stock-vente.quantite})
  //             .then((result) => {
  //                 listVentes.push(vente);
  //                 console.log(listVentes);
  //                 panier.listProduits = listVentes;
  //                 // panier.listProduits.push(vente);
  //                 // console.log(panier);
  //                 // console.log(panier.listProduits.length);

  //             })
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     });
  //     // console.log(panier.listProduits.length);

  //     console.log(panier);
  //     // panier.save()
  //     //   .then((result) => {
  //     //     return res
  //     //       .status(200)
  //     //       .json({ success: true, message: "Vendu avec succes" });
  //     //   })
  //     //   .catch((err) => {
  //     //     return res.status(400).json({ success: false, message: "echec vente" });
  //     //   });
  //   }),

  annulerVente: async (req, res, next) => {
    let vente = await Vente.findOne({ _id: req.params.idVente });
    console.log(vente);
    if (vente) {
      for (let index = 0; index < vente.listProduits.length; index++) {
        const element = vente.listProduits[index];
        let prodVente = await Produit.findOne({ name: element.productName });
        if (prodVente) {
          console.log(prodVente);
          console.log(element.quantite);
          prodVente.stock += element.quantite;
          let updatedProd = await prodVente.save();
          console.log(updatedProd);
          if (!updatedProd) {
            return res
              .status(400)
              .json({ success: false, message: "erreur annulation " });
          }
        }
      }
      vente.status = "annule";
      vente.createdAt = Date.now();

      let venteAnnule = await vente.save();

      if (venteAnnule) {
        return res.status(200).json({ success: true, message: "vente annulé" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "erreur annulation 1" });
      }
    }
    // Vente.updateOne({_id: req.params.idVente}, {status: "annule", updatedAt: Date.now()})
    // .then((result) => {
    //   // for (let index = 0; index < result.listProduits.length; index++) {
    //   //   const prod = result.listProduits[index];
    //   //   Produit.findOne({name: prod.productName})
    //   //   .then((result) => {
    //   //     Produit.updateOne({name: prod.productName}, {stock: result.stock+prod.quantite})
    //   //   }).catch((err) => {
    //   //     return res.status(400).json({ success: false, message: "erreur annulation 1" });
    //   //   });

    //   // }
    //   return res.status(200).json({ success: true, message: "vente annulé" });
    // }).catch((err) => {
    //   return res.status(400).json({ success: false, message: "erreur annulation2" });

    // });
  },

  hideVentes: (req, res, next) => {
    var productName = req.params.productName;

    console.log(productName);

    Ticket.updateMany(
      { productName: productName },
      { visible: false, evaluatedAt: Date.now() }
    )
      .then(() => {
        res.status(200).json({ success: true, message: "evalue avec succes" });
      })
      .catch(() => {
        res
          .status(400)
          .json({ succes: false, message: "peut pas etre evalue" });
      });
  },
};
