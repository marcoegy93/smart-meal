import { Section } from "../../../domain/model/Section";
import { ItemsMock, SectionsMock } from "../ItemsDataInMemory";

export class ItemsDb {

  public static itemsMock: ItemsMock[] = [
    {
      restaurantId: "resto1",
      items: [
        // Plats principaux
        {
          type: "SIMPLE",
          name: "Steak frites",
          illustration: "https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1732882503900_images.jpeg?alt=media&token=02396af9-434f-467a-b020-310a5a25ebd8",
          duration: 15,
          price: 18.00,
          status: "ACTIVE",
          ingredients: ["Steak", "Pomme de terre"],
          keywords: ["rapide", "populaire"],
          categories: ["Plat principal"],
          itemId: "item1"
        },
        {
          type: "SIMPLE",
          name: "Poulet rôti",
          illustration: "image_poulet_roti.png",
          duration: 20,
          price: 15.00,
          status: "ACTIVE",
          ingredients: ["Poulet", "Herbes"],
          keywords: ["favori", "classique"],
          categories: ["Plat principal"],
          itemId: "item2"
        },
        // Boissons
        {
          type: "SIMPLE",
          name: "Café",
          illustration: "image_cafe.png",
          duration: 5,
          price: 3.00,
          status: "ACTIVE",
          ingredients: ["Café"],
          keywords: ["rapide"],
          categories: ["Boisson"],
          itemId: "item4"
        },
        {
          type: "SIMPLE",
          name: "Vin rouge",
          illustration: "image_vin_rouge.png",
          duration: 5,
          price: 5.00,
          status: "ACTIVE",
          ingredients: ["Raisin"],
          keywords: ["populaire", "classique"],
          categories: ["Boisson"],
          itemId: "item5"
        },
        // Desserts
        {
          type: "SIMPLE",
          name: "Tarte aux pommes",
          illustration: "image_tarte_pommes.png",
          duration: 10,
          price: 6.00,
          status: "ACTIVE",
          ingredients: ["Pomme", "Pâte", "Cannelle"],
          keywords: ["classique"],
          categories: ["Dessert"],
          itemId: "item6"
        },
        {
          type: "COMPOSE",
          name: "Menu Dégustation",
          illustration: "image_menu_degustation.png",
          duration: 30,
          price: 40.00,
          status: "ACTIVE",
          ingredients: ["Steak", "Pomme de terre", "Café", "Pomme"],
          keywords: ["nouveau", "favori"],
          categories: ["Plat principal", "Boisson", "Dessert"],
          itemId: "item7",
          sections: [
            {
              items: [
                {
                  type: "SIMPLE",
                  name: "Steak frites",
                  illustration: "https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1732882503900_images.jpeg?alt=media&token=02396af9-434f-467a-b020-310a5a25ebd8",
                  duration: 15,
                  price: 18.00,
                  status: "ACTIVE",
                  ingredients: ["Steak", "Pomme de terre"],
                  keywords: ["rapide", "populaire"],
                  categories: ["Plat principal"],
                  itemId: "item1"
                }
              ],
              name: "Plat Principal",
              type: "MAIN",
              position: 1,
              choiceLimitMin: 1,
              choiceLimitMax: 1,
              sectionId: "sec1"
            },
            {
              items: [
                {
                  type: "SIMPLE",
                  name: "Café",
                  illustration: "image_cafe.png",
                  duration: 5,
                  price: 3.00,
                  status: "ACTIVE",
                  ingredients: ["Café"],
                  keywords: ["rapide"],
                  categories: ["Boisson"],
                  itemId: "item4"
                },
                {
                  type: "SIMPLE",
                  name: "Vin rouge",
                  illustration: "image_vin_rouge.png",
                  duration: 5,
                  price: 5.00,
                  status: "ACTIVE",
                  ingredients: ["Raisin"],
                  keywords: ["populaire", "classique"],
                  categories: ["Boisson"],
                  itemId: "item5"
                }
              ],
              name: "Boissons",
              type: "ADDITIONAL",
              position: 2,
              choiceLimitMin: 1,
              choiceLimitMax: 2,
              sectionId: "sec2"
            },
            {
              items: [
                {
                  type: "SIMPLE",
                  name: "Tarte aux pommes",
                  illustration: "image_tarte_pommes.png",
                  duration: 10,
                  price: 6.00,
                  status: "ACTIVE",
                  ingredients: ["Pomme", "Pâte", "Cannelle"],
                  keywords: ["classique"],
                  categories: ["Dessert"],
                  itemId: "item6"
                }
              ],
              name: "Desserts",
              type: "ADDITIONAL",
              position: 3,
              choiceLimitMin: 1,
              choiceLimitMax: 1,
              sectionId: "sec3"
            }
          ]
        }
      ]
    }
  ];
  public static sectionsMock: SectionsMock[] = [
    {
      restaurantId: "resto1",
      sections: [
        {
          items: [
            {
              type: "SIMPLE",
              name: "Steak frites",
              illustration: "https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1732882503900_images.jpeg?alt=media&token=02396af9-434f-467a-b020-310a5a25ebd8",
              duration: 15,
              price: 18.00,
              status: "ACTIVE",
              ingredients: ["Steak", "Pomme de terre"],
              keywords: ["rapide", "populaire"],
              categories: ["Plat principal"],
              itemId: "item1"
            }
          ],
          name: "Plat Principal",
          type: "MAIN",
          position: 1,
          choiceLimitMin: 1,
          choiceLimitMax: 1,
          sectionId: "sec1"
        },
        {
          items: [
            {
              type: "SIMPLE",
              name: "Café",
              illustration: "image_cafe.png",
              duration: 5,
              price: 3.00,
              status: "ACTIVE",
              ingredients: ["Café"],
              keywords: ["rapide"],
              categories: ["Boisson"],
              itemId: "item4"
            },
            {
              type: "SIMPLE",
              name: "Vin rouge",
              illustration: "image_vin_rouge.png",
              duration: 5,
              price: 5.00,
              status: "ACTIVE",
              ingredients: ["Raisin"],
              keywords: ["populaire", "classique"],
              categories: ["Boisson"],
              itemId: "item5"
            }
          ],
          name: "Boissons",
          type: "ADDITIONAL",
          position: 2,
          choiceLimitMin: 1,
          choiceLimitMax: 2,
          sectionId: "sec2"
        },
        {
          items: [
            {
              type: "SIMPLE",
              name: "Tarte aux pommes",
              illustration: "image_tarte_pommes.png",
              duration: 10,
              price: 6.00,
              status: "ACTIVE",
              ingredients: ["Pomme", "Pâte", "Cannelle"],
              keywords: ["classique"],
              categories: ["Dessert"],
              itemId: "item6"
            }
          ],
          name: "Desserts",
          type: "ADDITIONAL",
          position: 3,
          choiceLimitMin: 1,
          choiceLimitMax: 1,
          sectionId: "sec3"
        }
      ]
    }
  ];
}
