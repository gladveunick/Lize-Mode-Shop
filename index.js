// Initialisation
import { data } from "./data.js";
import { generateDialogHTML, generateProductHTML } from "./functions.js";

const productsContainer = document.querySelector(".produits");
const dialog = document.querySelector("dialog");
let produitsCarte = [];
let nombreProduit = document.querySelector(".carte .nombre");
nombreProduit.textContent = produitsCarte.length;
const input = document.querySelector(".recherche");

// Filtrage des produits selon la recherche
input.addEventListener("keyup", (e) => {
  const filtre = data.filter((p) => {
    return p.nom.toLowerCase().includes(e.target.value);
  });

  productsContainer.innerHTML = "";

  if (filtre.length > 0) {
    afficherProuduits(filtre);
  } else {
    const vide = document.createElement("h3");
    vide.textContent = "Aucun produit trouvé";
    vide.style.opacity = 0;
    productsContainer.appendChild(vide);

    setTimeout(() => {
      vide.style.transition = "opacity 1s";
      vide.style.opacity = 1;
    }, 10);
  }
});

// Affichage des produits
const afficherProuduits = (produits) => {
  produits.forEach((produit) => {
    const produitHTML = document.createElement("div");
    produitHTML.classList.add("carte-produit");
    produitHTML.setAttribute("data-id", produit.id);
    produitHTML.innerHTML = generateProductHTML(produit);
    productsContainer.appendChild(produitHTML);
  });
};

afficherProuduits(data);

// Vérification si un produit existe déjà dans le panier
const testerSiProduitExiste = (arr, produit) => {
  return arr.some((p) => p.id === produit.id);
};

// Récupération d'un produit par son ID
const getProduitById = (arr, id) => {
  return arr.find((p) => p.id === id);
};

// Gestion des clics sur les cartes de produit
const cartes = document.querySelectorAll(".carte-produit");

cartes.forEach((produit) => {
  produit.addEventListener("click", () => {
    const contenuDialog = document.querySelector(".dialog-menu");
    contenuDialog && contenuDialog.remove();
    dialog.showModal();

    const currentProduct = data.filter((p) => p.id == produit.dataset.id)[0];

    const section = document.createElement("section");
    section.classList.add("dialog-menu");
    section.innerHTML = generateDialogHTML(currentProduct);
    dialog.appendChild(section);

    let qteProduit = 1; // Initialisation de la quantité à 1

    if (testerSiProduitExiste(produitsCarte, currentProduct)) {
      const existingProduct = getProduitById(produitsCarte, currentProduct.id);
      qteProduit = existingProduct.quantity;
    }

    const qte = document.querySelector(".qte");
    qte.textContent = qteProduit;

    const ajouter = document.querySelector(".ajouter");

    ajouter.addEventListener("click", () => {
      if (testerSiProduitExiste(produitsCarte, currentProduct)) {
        produitsCarte = produitsCarte.filter((p) => p.id !== currentProduct.id);
        ajouter.innerHTML = `<div class="icon"><i class="fa-solid fa-plus"></i></div><p>Ajouter au panier</p>`;
        ajouter.classList.remove("ajoute");
        qte.textContent = 0;
      } else {
        currentProduct.quantity = qteProduit;
        produitsCarte.push(currentProduct);
        ajouter.textContent = "Effacer du panier";
        ajouter.classList.add("ajoute");
      }
      nombreProduit.textContent = produitsCarte.length;
    });

    const reduireQte = document.querySelector(".counter .fa-minus");
    const augmenterQte = document.querySelector(".counter .fa-plus");

    augmenterQte.addEventListener("click", () => {
      qteProduit += 1;
      qte.textContent = qteProduit;
      if (testerSiProduitExiste(produitsCarte, currentProduct)) {
        getProduitById(produitsCarte, currentProduct.id).quantity = qteProduit;
      }
    });

    reduireQte.addEventListener("click", () => {
      if (qteProduit > 1) {
        qteProduit -= 1;
        qte.textContent = qteProduit;
        if (testerSiProduitExiste(produitsCarte, currentProduct)) {
          getProduitById(produitsCarte, currentProduct.id).quantity = qteProduit;
        }
      }
    });

    if (testerSiProduitExiste(produitsCarte, currentProduct)) {
      ajouter.textContent = "Effacer du panier";
      ajouter.classList.add("ajoute");
    }
  });
});

// Fermeture du dialogue
const close = document.querySelector(".close");

close.addEventListener("click", () => {
  dialog.close();
});
