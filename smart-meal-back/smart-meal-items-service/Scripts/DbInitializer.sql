USE [smartmealdata]
GO
/****** Object:  Table [dbo].[Administrator]    Script Date: 18/02/2025 16:24:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Administrator](
    [administrator_id] [int] IDENTITY(1,1) NOT NULL,
    [restaurant_id] [int] NULL,
    [firstname] [nvarchar](255) NULL,
    [lastname] [nvarchar](255) NULL,
    [email] [nvarchar](255) NULL,
    [phone] [nvarchar](15) NULL,
    [password] [nvarchar](255) NULL,
    [Illustration] [nvarchar](max) NULL,
    PRIMARY KEY CLUSTERED
(
[administrator_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Category]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Category](
    [category_id] [int] IDENTITY(1,1) NOT NULL,
    [restaurant_id] [int] NULL,
    [name] [nvarchar](255) NULL,
    [illustration] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Ingredient]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Ingredient](
    [ingredient_id] [int] IDENTITY(1,1) NOT NULL,
    [restaurant_id] [int] NULL,
    [name] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[ingredient_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Item]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Item](
    [item_id] [int] IDENTITY(1,1) NOT NULL,
    [restaurant_id] [int] NULL,
    [name] [nvarchar](255) NULL,
    [illustration] [nvarchar](255) NULL,
    [type] [int] NULL,
    [price] [float] NULL,
    [status] [int] NULL,
    [duration] [int] NULL,
    [description] [nvarchar](max) NULL,
    [isRemoved] [bit] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[item_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[ItemCategory]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[ItemCategory](
    [category_id] [int] NULL,
    [item_id] [int] NULL
) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[ItemDuration]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[ItemDuration](
    [IdItemDuration] [int] NOT NULL,
    [Duration] [int] NULL,
     PRIMARY KEY CLUSTERED
    (
[IdItemDuration] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[ItemIngredient]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[ItemIngredient](
    [ingredient_id] [int] NULL,
    [item_id] [int] NULL
) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[ItemSection]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[ItemSection](
    [item_id] [int] NULL,
    [section_id] [int] NULL,
    [position] [int] NULL
) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[ItemStatus]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[ItemStatus](
    [idItemStatus] [int] IDENTITY(1,1) NOT NULL,
    [status] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[idItemStatus] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[ItemType]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[ItemType](
    [idItemType] [int] IDENTITY(1,1) NOT NULL,
    [type] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[idItemType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Keyword]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Keyword](
    [keyword_id] [int] IDENTITY(1,1) NOT NULL,
    [name] [nvarchar](255) NULL,
    [restaurant_id] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[keyword_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[KeywordItem]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[KeywordItem](
    [item_id] [int] NULL,
    [keyword_id] [int] NULL
) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Order]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Order](
    [order_id] [int] IDENTITY(1,1) NOT NULL,
    [restaurant_id] [int] NOT NULL,
    [username] [nvarchar](255) NULL,
    [status] [int] NOT NULL,
    [order_date] [datetime] NOT NULL,
    [payment_id] [varchar](50) NULL,
    [payment_price] [decimal](10, 2) NULL,
    [TableId] [int] NULL,
    [OrderDestination] [nvarchar](50) NULL,
    [UserFingerprint] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[OrderChosenItem]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[OrderChosenItem](
    [order_chosen_item_id] [int] IDENTITY(1,1) NOT NULL,
    [order_id] [int] NOT NULL,
    [item_id] [int] NOT NULL,
    [quantity] [int] NOT NULL,
    [position] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[order_chosen_item_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[OrderChosenItemAdditionalDetails]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[OrderChosenItemAdditionalDetails](
    [order_chosen_item_additional_details_id] [int] IDENTITY(1,1) NOT NULL,
    [order_chosen_item_id] [int] NOT NULL,
    [additional_item_id] [int] NOT NULL,
    [quantity] [int] NOT NULL,
    [positionItemParent] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[order_chosen_item_additional_details_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[OrderStatus]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[OrderStatus](
    [status_id] [int] IDENTITY(1,1) NOT NULL,
    [status_name] [nvarchar](255) NOT NULL,
    PRIMARY KEY CLUSTERED
(
[status_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Restaurant]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Restaurant](
    [restaurant_id] [int] IDENTITY(1,1) NOT NULL,
    [name] [nvarchar](255) NULL,
    [address] [nvarchar](255) NULL,
    [siret] [nvarchar](14) NULL,
    [illustration] [nvarchar](255) NULL,
    [Tva] [nvarchar](20) NULL,
    [payment_id] [nvarchar](max) NULL,
    [ContractUrl] [nvarchar](max) NULL,
    [IsVisible] [bit] NULL,
    PRIMARY KEY CLUSTERED
(
[restaurant_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[Section]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[Section](
    [section_id] [int] IDENTITY(1,1) NOT NULL,
    [name] [nvarchar](255) NULL,
    [type] [int] NULL,
    [choiceLimitMax] [int] NULL,
    [choiceLimitMin] [int] NULL,
    [restaurant_id] [int] NULL,
    PRIMARY KEY CLUSTERED
(
[section_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[SectionItem]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[SectionItem](
    [section_id] [int] NOT NULL,
    [item_id] [int] NOT NULL
) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[SectionType]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[SectionType](
    [idSectionType] [int] IDENTITY(1,1) NOT NULL,
    [type] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[idSectionType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
/****** Object:  Table [dbo].[UserKitchen]    Script Date: 18/02/2025 16:24:14 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE TABLE [dbo].[UserKitchen](
    [userkitchen_id] [int] IDENTITY(1,1) NOT NULL,
    [restaurant_id] [int] NULL,
    [username] [nvarchar](255) NULL,
    [password] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[userkitchen_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
    GO
    SET IDENTITY_INSERT [dbo].[Administrator] ON

    INSERT [dbo].[Administrator] ([administrator_id], [restaurant_id], [firstname], [lastname], [email], [phone], [password], [Illustration]) VALUES (98, 102, N'Acil', N'Ramdani', N'a@a.aa', N'0687452545', N'$2a$10$7eDkgAI.wc4PWDRlAXFtA.I80eB/ITb1YRZ4YuA6pM3tMKL0SRbLO', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/admin-images%2F1738267826445_cropped_image.png?alt=media&token=a044974d-f8e9-4925-965f-ba9a88608a9e')
    INSERT [dbo].[Administrator] ([administrator_id], [restaurant_id], [firstname], [lastname], [email], [phone], [password], [Illustration]) VALUES (99, 103, N'Cherif', N'Deme', N'c@c.c', N'0777764787', N'$2a$10$oUeFhhY/q59SrPap/kYMD.rDAwqUe1etbfCCkRdTZWk3Wns5UZRRC', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/admin-images%2Fcropped_image.png?alt=media&token=86404f18-c0d2-42b4-9fef-04d891350200')
    INSERT [dbo].[Administrator] ([administrator_id], [restaurant_id], [firstname], [lastname], [email], [phone], [password], [Illustration]) VALUES (104, 108, N'Acil', N'Ramdani', N'aaa@gmail.com', N'0781792491', N'$2a$10$ie.gn5ff.C3GgFFEEYNDveo3ECAOMor8bB32T1ybXrRNOXR8S/WzW', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/admin-images%2Fcropped_image.png?alt=media&token=8d3221d7-bb7d-4f87-9eda-ced051643ad0')
    INSERT [dbo].[Administrator] ([administrator_id], [restaurant_id], [firstname], [lastname], [email], [phone], [password], [Illustration]) VALUES (105, 109, N'Marco', N'Balamon', N'aaaaa@gmail.com', N'0781792491', N'$2a$10$rr0PhQ1.0UdKOZauGdgfpOTSarUzUm/fRfNhzSR8MbzZpwnfen5FW', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/admin-images%2Fcropped_image.png?alt=media&token=644513f1-2796-49a8-a590-116902d1ceba')
    INSERT [dbo].[Administrator] ([administrator_id], [restaurant_id], [firstname], [lastname], [email], [phone], [password], [Illustration]) VALUES (106, 110, N'Acil', N'Ramdani', N'maisondufour93240@gmail.com', N'0781792491', N'$2a$10$/KHHgSGpWzo/55xL21e1yuh8d5UoxgvKuRNNmQX5NK6eBXsqXizeK', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/admin-images%2Fcropped_image.png?alt=media&token=94e3421c-bd10-4826-a7b2-9b94dd486519')
    SET IDENTITY_INSERT [dbo].[Administrator] OFF
    GO
    SET IDENTITY_INSERT [dbo].[Category] ON

    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (130, 110, N'Pizza feu de bois 🪵🔥', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (131, 110, N'Dessert 🍰 🍨', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (132, 110, N'Boisson 🥤❄️', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (135, 110, N'Menu 🥄🔥', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (136, 110, N'🎉 Promotion', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (142, 103, N'Appetizer', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (143, 103, N'Main dish', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (144, 103, N'Lunch special', NULL)
    INSERT [dbo].[Category] ([category_id], [restaurant_id], [name], [illustration]) VALUES (145, 103, N'Pizza feu de bois 🪵🔥', NULL)
    SET IDENTITY_INSERT [dbo].[Category] OFF
    GO
    SET IDENTITY_INSERT [dbo].[Ingredient] ON

    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (146, 110, N'Sauce tomate')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (147, 110, N'Mozzarella')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (148, 110, N'Champignon')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (149, 110, N'Pepperoni')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (150, 110, N'Herbe fraiche')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (151, 110, N'Olive')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (152, 110, N'Farine')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (153, 110, N'Oeuf')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (154, 110, N'Fraise')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (155, 110, N'Chocolat')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (156, 110, N'Lait')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (157, 110, N'Sucre')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (158, 110, N'Pomme')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (159, 110, N'Canette')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (160, 110, N'Boisson')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (162, 110, N'Pizza')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (163, 110, N'Dessert')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (169, 103, N'Sea salt')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (170, 103, N'Edamame')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (171, 103, N'Rice noodles')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (172, 103, N'Chicken')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (173, 103, N'Eggs')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (174, 103, N'Peanuts')
    INSERT [dbo].[Ingredient] ([ingredient_id], [restaurant_id], [name]) VALUES (175, 103, N'Dessert')
    SET IDENTITY_INSERT [dbo].[Ingredient] OFF
    GO
    SET IDENTITY_INSERT [dbo].[Item] ON

    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (256, 110, N'Pizza Champ & Basilic 🍄🌿', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738262742964_cropped_image.png?alt=media&token=f2a531c1-135e-4f78-a2bb-36a9d8af4957', 1, 10, 1, 2, N'Une pizza savoureuse et légère, parfaite pour les amateurs de champignons. La combinaison du fromage fondant et des champignons légèrement grillés, agrémentée de basilic frais, apporte une touche aromatique délicieuse.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (257, 110, N'Pizza Margherita 🍅🧀', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738263093477_cropped_image.png?alt=media&token=344a84ef-5d45-4541-81ec-379119e9c453', 1, 12, 1, 2, N'La pizza italienne par excellence ! Simple mais incroyablement savoureuse, elle associe une sauce tomate onctueuse, une mozzarella fondante et du basilic frais pour un équilibre parfait entre douceur et fraîcheur.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (259, 102, N'Pizza Pepperoni 🔥🧀', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738263575722_cropped_image.png?alt=media&token=6ce26ebb-5890-413b-ae94-965f66d24d69', 1, 12, 1, 2, N'Une pizza gourmande avec une généreuse couche de mozzarella et des tranches de pepperoni légèrement croustillantes. Légèrement épicée et riche en saveurs, elle est idéale pour les amateurs de sensations fortes.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (260, 110, N'Pizza Forestière 🌲🍕', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738264531409_cropped_image.png?alt=media&token=6a2fe523-dd91-4d0d-a60a-cebba5b7eb06', 1, 12, 1, 2, N'Inspirée des saveurs de la forêt, cette pizza associe des champignons savoureux et des herbes fraîches qui rehaussent le goût du fromage fondant. Un choix parfait pour les amateurs de saveurs authentiques et rustiques.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (261, 110, N'Pizza Quatre Saisons 🌈🍽️', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738266730479_cropped_image.png?alt=media&token=eb08ffe9-6ae9-4112-a2ac-f2211ecb5651', 1, 12, 1, 2, N' Une explosion de couleurs et de saveurs ! Cette pizza combine différents ingrédients emblématiques de chaque saison pour une expérience gustative variée et équilibrée. Chaque bouchée offre un mélange unique de textures et d’arômes.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (262, 110, N'Pizza Classique 🌶️🍕', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738266919951_cropped_image.png?alt=media&token=f6a2cb3d-17bb-4195-9216-0ec9ce48b825', 1, 12, 1, 2, N'Un incontournable des amateurs de pepperoni ! Son goût intense et légèrement épicé, combiné à une mozzarella fondante, en fait une pizza généreuse et irrésistible. Parfaite pour ceux qui aiment les saveurs audacieuses.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (263, 110, N'Gaufre 🥞', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738269738507_cropped_image.png?alt=media&token=e55fe884-9544-4f40-8e12-8f6ed1bd8138', 1, 5, 1, 2, N'Découvrez notre gaufre dorée et croustillante, moelleuse à cœur, accompagnée d’un généreux nuage de chantilly et d’un filet de caramel fondant. Une explosion de gourmandise à chaque bouchée ! ', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (264, 110, N'Tarte à la fraise 🍓 🍰', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738269877557_cropped_image.png?alt=media&token=93901c0c-3f3f-4524-996a-e5cd43504c26', 1, 6, 1, 1, N'Succombez à notre tarte aux fraises maison, une pâte sablée croustillante garnie d’une crème pâtissière onctueuse et de fraises fraîches juteuses. Un pur moment de douceur et de fraîcheur ! ', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (265, 110, N'Tarte aux pommes 🍏 🥧', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738270137060_cropped_image.png?alt=media&token=7e080898-e1e8-4ce2-9fac-f5d38a183a4d', 1, 6, 1, 1, N'Laissez-vous tenter par notre tarte aux pommes maison, une pâte dorée et croustillante garnie de pommes fondantes et caramélisées, délicatement parfumées à la cannelle. Un dessert classique et réconfortant qui ravira vos papilles !', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (266, 110, N'Beignet Chocolat', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738270454951_cropped_image.png?alt=media&token=b7f62681-260f-4ccb-8bee-5d99b40c0d0e', 1, 4, 1, 1, N'Dégustez nos beignets au chocolat, légers et moelleux, enrobés de sucre glace et remplis d’un délicieux cœur fondant de chocolat. Chaque bouchée est une explosion de douceur et de plaisir chocolaté !', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (267, 110, N'Fanta 🍊 🥤', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738270716661_cropped_image.png?alt=media&token=90c269e9-83d3-48e8-bc9f-2ce6a5c4633d', 1, 2, 1, 1, N'Rafraîchissez-vous avec nos canettes de boissons sélectionnées, alliant fraîcheur et saveurs authentiques. ', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (268, 110, N'Schweppes Lemon 🥤🍋', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738270870251_cropped_image.png?alt=media&token=cbf8cd58-d78e-459a-ab47-a95eb5454bb7', 1, 2, 1, 1, N'Rafraîchissez-vous avec nos canettes de boissons sélectionnées, alliant fraîcheur et saveurs authentiques.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (269, 110, N'Coca Cola 🥤💥', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738270965676_cropped_image.png?alt=media&token=7276ac94-4041-435d-98ad-3df8e40fc144', 1, 2, 1, 1, N'Rafraîchissez-vous avec nos canettes de boissons sélectionnées, alliant fraîcheur et saveurs authentiques.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (270, 110, N'Pepsi 🥤💥', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738271043623_cropped_image.png?alt=media&token=fb0ed259-d86a-412c-ac5a-e40a54b1aa49', 1, 2, 1, 1, N'Rafraîchissez-vous avec nos canettes de boissons sélectionnées, alliant fraîcheur et saveurs authentiques.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (272, 110, N'Sprite 🥤🍋', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738271797116_cropped_image.png?alt=media&token=22c6ab0c-fe22-4f25-8689-9a1e64f91179', 1, 2, 1, 1, N'Rafraîchissez-vous avec nos canettes de boissons sélectionnées, alliant fraîcheur et saveurs authentiques.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (274, 110, N'Menu Gourmand 🍕🥤🍰', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738329841870_cropped_image.png?alt=media&token=010865fd-4ff5-42aa-a02d-334c99dc424b', 2, 25, 1, 2, N'Offrez-vous un moment savoureux avec notre menu personnalisé, conçu pour satisfaire toutes les envies !  🍕 2 Pizzas au choix 🥤 1 Boisson au choix  et 🍰  1 Dessert au choix', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (283, 110, N'Menu Family 👨‍👩‍👧‍👦', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738331536538_cropped_image.png?alt=media&token=43bab4ab-76d0-4dda-936f-5e9a54f075ad', 2, 50, 1, 3, N'Parce que les meilleurs moments se partagent, découvrez notre Menu Family, idéal pour un repas en famille ou entre amis ! 🍕 4 Pizzas au choix et 🥤 4 Boissons au choix', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (289, 110, N'Spéciale Février', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738332645041_cropped_image.png?alt=media&token=14863971-75ae-4a3e-bd40-a28ca06a8e6f', 2, 15, 1, 2, N'Février, c''est le mois de la gourmandise et du partage ! Pour l''occasion, SmartMeal vous propose une offre exclusive à ne pas manquer', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (295, 103, N'Edamame', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738457648048_cropped_image.png?alt=media&token=982373de-4e17-4742-85bb-f3b7cbd7a468', 1, 3, 1, 2, N'Description: Steamed young soybeans lightly sprinkled with sea salt, a healthy and savory snack.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (296, 103, N'Chicken Pad Thai', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738457934209_cropped_image.png?alt=media&token=88f672a3-93b9-4cb5-a12f-632c8f37785f', 1, 11, 1, 2, N'Stir-fried rice noodles with chicken, eggs, peanuts, and bean sprouts in a tangy tamarind sauce.', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (297, 103, N'Lunch special', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738458499322_cropped_image.png?alt=media&token=6d9562d0-58ad-4990-8eb1-e2c853103d62', 2, 18, 1, 2, N'Lunch special', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (298, 103, N'g', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738536584489_cropped_image.png?alt=media&token=cc5734ea-7d6f-4450-9ca2-fc6b131b8e74', 1, 1, 1, 1, N'g', 0)
    INSERT [dbo].[Item] ([item_id], [restaurant_id], [name], [illustration], [type], [price], [status], [duration], [description], [isRemoved]) VALUES (307, 110, N'Burger', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/images%2Fitems%2F1738750495773_cropped_image.png?alt=media&token=7dc362ac-bb75-4fc3-aed7-e443068dc2d7', 1, 11, 1, 5, N'Délicieux burger', 1)
    SET IDENTITY_INSERT [dbo].[Item] OFF
    GO
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (130, 256)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (131, 263)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (131, 264)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (131, 265)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (145, 298)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (135, 283)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (144, 297)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (142, 295)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (143, 296)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (136, 289)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (135, 274)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (130, 257)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (130, 259)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (130, 260)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (130, 261)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (130, 262)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (132, 267)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (132, 268)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (132, 269)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (132, 270)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (132, 272)
    INSERT [dbo].[ItemCategory] ([category_id], [item_id]) VALUES (131, 266)
    GO
    INSERT [dbo].[ItemDuration] ([IdItemDuration], [Duration]) VALUES (1, 5)
    INSERT [dbo].[ItemDuration] ([IdItemDuration], [Duration]) VALUES (2, 15)
    INSERT [dbo].[ItemDuration] ([IdItemDuration], [Duration]) VALUES (3, 30)
    GO
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (146, 256)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (147, 256)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (148, 256)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (152, 263)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (153, 263)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (154, 263)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (155, 263)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (156, 263)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (153, 264)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (154, 264)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (156, 264)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (157, 264)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (153, 265)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (156, 265)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (157, 265)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (158, 265)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (175, 298)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 283)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (162, 283)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (172, 297)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (169, 295)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (170, 295)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (171, 296)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (172, 296)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (173, 296)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (174, 296)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 289)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (162, 289)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (163, 289)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 274)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (162, 274)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (163, 274)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (146, 257)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (147, 257)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (146, 259)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (149, 259)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (146, 260)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (147, 260)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (148, 260)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (150, 260)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (146, 261)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (148, 261)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (151, 261)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (146, 262)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (147, 262)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (149, 262)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (159, 267)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 268)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 269)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 270)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (160, 272)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (153, 266)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (155, 266)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (156, 266)
    INSERT [dbo].[ItemIngredient] ([ingredient_id], [item_id]) VALUES (157, 266)
    GO
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (274, 70, 1)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (274, 77, 2)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (274, 71, 3)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (283, 73, 1)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (283, 74, 2)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (297, 79, 1)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (297, 80, 2)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (289, 78, 1)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (289, 77, 2)
    INSERT [dbo].[ItemSection] ([item_id], [section_id], [position]) VALUES (289, 71, 3)
    GO
    SET IDENTITY_INSERT [dbo].[ItemStatus] ON

    INSERT [dbo].[ItemStatus] ([idItemStatus], [status]) VALUES (1, N'ACTIVE')
    INSERT [dbo].[ItemStatus] ([idItemStatus], [status]) VALUES (2, N'DISABLED')
    INSERT [dbo].[ItemStatus] ([idItemStatus], [status]) VALUES (3, N'OUT_OF_STOCK')
    SET IDENTITY_INSERT [dbo].[ItemStatus] OFF
    GO
    SET IDENTITY_INSERT [dbo].[ItemType] ON

    INSERT [dbo].[ItemType] ([idItemType], [type]) VALUES (1, N'SIMPLE')
    INSERT [dbo].[ItemType] ([idItemType], [type]) VALUES (2, N'COMPOUND')
    SET IDENTITY_INSERT [dbo].[ItemType] OFF
    GO
    SET IDENTITY_INSERT [dbo].[Keyword] ON

    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (134, N'Végétarienne', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (135, N'Italienne', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (136, N'Feux de bois', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (137, N'Légère', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (138, N'Classique', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (139, N'Traditionelle', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (140, N'Carnivore', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (141, N'Epicée', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (142, N'Gourmande', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (143, N'Rustique', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (144, N'Généreuse', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (145, N'Equilibré', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (146, N'Sucrée', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (147, N'Fait-Maison', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (148, N'Savoureux', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (149, N'Pomme', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (150, N'Gourmand', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (151, N'Chocolat', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (152, N'Orange', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (153, N'Gazeux', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (154, N'Citron', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (156, N'Limonade', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (158, N'Menu', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (159, N'Menu Family', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (160, N'Pizza', 110)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (166, N'Healthy', 103)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (167, N'Sweet', 103)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (168, N'Tangy', 103)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (169, N'Stir-fry', 103)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (170, N'Lunch', 103)
    INSERT [dbo].[Keyword] ([keyword_id], [name], [restaurant_id]) VALUES (171, N'Végétarienne', 103)
    SET IDENTITY_INSERT [dbo].[Keyword] OFF
    GO
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (256, 134)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (256, 135)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (256, 136)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (256, 137)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (263, 142)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (263, 146)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (264, 142)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (264, 147)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (264, 148)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (265, 147)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (265, 149)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (298, 171)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (283, 159)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (297, 170)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (295, 166)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (296, 167)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (296, 168)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (296, 169)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (289, 135)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (289, 160)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (274, 158)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (257, 135)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (257, 138)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (257, 139)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (259, 140)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (259, 141)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (259, 142)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (260, 134)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (260, 143)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (261, 144)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (261, 145)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (262, 138)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (262, 140)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (262, 141)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (267, 152)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (267, 153)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (268, 153)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (268, 154)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (269, 153)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (270, 153)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (272, 153)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (272, 156)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (266, 150)
    INSERT [dbo].[KeywordItem] ([item_id], [keyword_id]) VALUES (266, 151)
    GO
    SET IDENTITY_INSERT [dbo].[OrderStatus] ON

    INSERT [dbo].[OrderStatus] ([status_id], [status_name]) VALUES (1, N'READY')
    INSERT [dbo].[OrderStatus] ([status_id], [status_name]) VALUES (2, N'TO_PAY')
    INSERT [dbo].[OrderStatus] ([status_id], [status_name]) VALUES (3, N'DONE')
    INSERT [dbo].[OrderStatus] ([status_id], [status_name]) VALUES (4, N'CANCELLED')
    INSERT [dbo].[OrderStatus] ([status_id], [status_name]) VALUES (5, N'IN_PROGRESS')
    SET IDENTITY_INSERT [dbo].[OrderStatus] OFF
    GO
    SET IDENTITY_INSERT [dbo].[Restaurant] ON

    INSERT [dbo].[Restaurant] ([restaurant_id], [name], [address], [siret], [illustration], [Tva], [payment_id], [ContractUrl], [IsVisible]) VALUES (102, N'Maison du four', N'32 Avenue marcel cachin, 93240 Stains', N'tt', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/restaurant-images%2F1738275668006_cropped_image.png?alt=media&token=7953c4b8-696d-4477-a2cb-8796c333ef08', N'tt', N'pm_1Qn2ezJDDdPAbT69AVLa4R1q', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/contracts%2F99_1738262422001.pdf?alt=media&token=c8915c64-7b8c-4c71-bee3-2d20879460e2', 0)
    INSERT [dbo].[Restaurant] ([restaurant_id], [name], [address], [siret], [illustration], [Tva], [payment_id], [ContractUrl], [IsVisible]) VALUES (103, N'Maloa', N'8 Rue de Rivolli, 75001 Paris', N'985432168433', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/restaurant-images%2Fcropped_image.png?alt=media&token=7d7a1a8d-e93c-4e4e-8ba3-b198fcf152bb', N'RC468ECG468', N'pm_1QnrCqJDDdPAbT699yvT6jkx', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/contracts%2F985432168433_1738456684586.pdf?alt=media&token=c86699f3-5a1c-4038-8071-7ab72fe288cd', 0)
    INSERT [dbo].[Restaurant] ([restaurant_id], [name], [address], [siret], [illustration], [Tva], [payment_id], [ContractUrl], [IsVisible]) VALUES (108, N'Maison du four', N'32 Avenue marcel cachin, 93240 Stains', N'81745326900018', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/restaurant-images%2Fcropped_image.png?alt=media&token=24cda9eb-a0b8-4980-af32-11e1cdf82072', N'FR96817453269', N'pm_1Qoq3qJDDdPAbT69JJZiz0M9', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/contracts%2F81745326900018_1738690647273.pdf?alt=media&token=5bd69168-89e9-48b2-a623-95c51ba23e15', 0)
    INSERT [dbo].[Restaurant] ([restaurant_id], [name], [address], [siret], [illustration], [Tva], [payment_id], [ContractUrl], [IsVisible]) VALUES (109, N'Maison du four', N'32 Avenue marcel cachin, 93240 Stains', N'81745326900018', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/restaurant-images%2Fcropped_image.png?alt=media&token=1cfe130e-4514-4827-9e08-c1d5d669c585', N'FR96817453269', N'pm_1QoqP9JDDdPAbT69DkSbROqJ', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/contracts%2F81745326900018_1738691968705.pdf?alt=media&token=4bbd4a9b-fba7-4ff9-85ad-fa3689e514d8', 0)
    INSERT [dbo].[Restaurant] ([restaurant_id], [name], [address], [siret], [illustration], [Tva], [payment_id], [ContractUrl], [IsVisible]) VALUES (110, N'Maison du four', N'32 Avenue marcel cachin, 93240 Stains', N'81745326900018', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/restaurant-images%2Fcropped_image.png?alt=media&token=c562583a-5b91-48b1-901f-cf466e2c6ac3', N'FR96817453269', N'pm_1QotulJDDdPAbT69QxPdtoVo', N'https://firebasestorage.googleapis.com/v0/b/smart-meal-a9743.firebasestorage.app/o/contracts%2F81745326900018_1738705459903.pdf?alt=media&token=47d8fb5b-358e-4035-8386-8bb51c81bc05', 1)
    SET IDENTITY_INSERT [dbo].[Restaurant] OFF
    GO
    SET IDENTITY_INSERT [dbo].[Section] ON

    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (70, N'Pizza feu de bois 🪵🔥', 1, 2, 2, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (71, N'Dessert 🍰 🍨', 1, 1, 1, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (73, N'Pizza feu de bois 🪵🔥', 1, 4, 4, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (74, N'Boisson 🥤❄️', 2, 4, 4, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (76, N'Boisson 🥤❄️', 2, 2, 2, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (77, N'Boisson 🥤❄️', 2, 1, 1, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (78, N'Pizza feu de bois 🪵🔥', 1, 1, 1, 110)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (79, N'Appetizer', 1, 2, 1, 103)
    INSERT [dbo].[Section] ([section_id], [name], [type], [choiceLimitMax], [choiceLimitMin], [restaurant_id]) VALUES (80, N'Main Dish', 2, 1, 1, 103)
    SET IDENTITY_INSERT [dbo].[Section] OFF
    GO
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (79, 295)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (80, 296)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (78, 256)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (78, 257)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (78, 259)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (78, 260)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (70, 256)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (70, 257)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (70, 259)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (70, 260)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (70, 261)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (78, 261)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (78, 262)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (77, 267)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (77, 268)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (76, 267)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (76, 268)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (76, 269)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (76, 270)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (76, 272)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (70, 262)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (77, 269)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (77, 270)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (77, 272)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (71, 263)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (71, 264)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (71, 265)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (73, 256)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (73, 257)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (73, 259)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (73, 260)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (73, 261)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (73, 262)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (74, 267)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (74, 268)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (74, 269)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (74, 270)
    INSERT [dbo].[SectionItem] ([section_id], [item_id]) VALUES (74, 272)
    GO
    SET IDENTITY_INSERT [dbo].[SectionType] ON

    INSERT [dbo].[SectionType] ([idSectionType], [type]) VALUES (1, N'MAIN')
    INSERT [dbo].[SectionType] ([idSectionType], [type]) VALUES (2, N'ADDITIONAL')
    INSERT [dbo].[SectionType] ([idSectionType], [type]) VALUES (1002, N'ASIDE')
    SET IDENTITY_INSERT [dbo].[SectionType] OFF
    GO
    SET ANSI_PADDING ON
    GO
/****** Object:  Index [UQ_Administrator_Email]    Script Date: 18/02/2025 16:24:15 ******/
ALTER TABLE [dbo].[Administrator] ADD  CONSTRAINT [UQ_Administrator_Email] UNIQUE NONCLUSTERED
    (
    [email] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    GO
ALTER TABLE [dbo].[Item] ADD  DEFAULT ((0)) FOR [isRemoved]
    GO
ALTER TABLE [dbo].[Order] ADD  DEFAULT (getdate()) FOR [order_date]
    GO
ALTER TABLE [dbo].[OrderChosenItem] ADD  DEFAULT ((1)) FOR [quantity]
    GO
ALTER TABLE [dbo].[OrderChosenItemAdditionalDetails] ADD  DEFAULT ((1)) FOR [quantity]
    GO
ALTER TABLE [dbo].[Restaurant] ADD  DEFAULT ((1)) FOR [IsVisible]
    GO
ALTER TABLE [dbo].[Administrator]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Administrator]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Category]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Category]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Ingredient]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Ingredient]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD FOREIGN KEY([status])
    REFERENCES [dbo].[ItemStatus] ([idItemStatus])
    GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD FOREIGN KEY([status])
    REFERENCES [dbo].[ItemStatus] ([idItemStatus])
    GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD FOREIGN KEY([type])
    REFERENCES [dbo].[ItemType] ([idItemType])
    GO
ALTER TABLE [dbo].[Item]  WITH CHECK ADD FOREIGN KEY([type])
    REFERENCES [dbo].[ItemType] ([idItemType])
    GO
ALTER TABLE [dbo].[ItemCategory]  WITH CHECK ADD FOREIGN KEY([category_id])
    REFERENCES [dbo].[Category] ([category_id])
    GO
ALTER TABLE [dbo].[ItemCategory]  WITH CHECK ADD FOREIGN KEY([category_id])
    REFERENCES [dbo].[Category] ([category_id])
    GO
ALTER TABLE [dbo].[ItemCategory]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[ItemCategory]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[ItemIngredient]  WITH CHECK ADD FOREIGN KEY([ingredient_id])
    REFERENCES [dbo].[Ingredient] ([ingredient_id])
    GO
ALTER TABLE [dbo].[ItemIngredient]  WITH CHECK ADD FOREIGN KEY([ingredient_id])
    REFERENCES [dbo].[Ingredient] ([ingredient_id])
    GO
ALTER TABLE [dbo].[ItemIngredient]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[ItemIngredient]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[ItemSection]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[ItemSection]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[ItemSection]  WITH CHECK ADD FOREIGN KEY([section_id])
    REFERENCES [dbo].[Section] ([section_id])
    GO
ALTER TABLE [dbo].[ItemSection]  WITH CHECK ADD FOREIGN KEY([section_id])
    REFERENCES [dbo].[Section] ([section_id])
    GO
ALTER TABLE [dbo].[Keyword]  WITH CHECK ADD  CONSTRAINT [FK_Keyword_Restaurant] FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Keyword] CHECK CONSTRAINT [FK_Keyword_Restaurant]
    GO
ALTER TABLE [dbo].[KeywordItem]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[KeywordItem]  WITH CHECK ADD FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[KeywordItem]  WITH CHECK ADD FOREIGN KEY([keyword_id])
    REFERENCES [dbo].[Keyword] ([keyword_id])
    GO
ALTER TABLE [dbo].[KeywordItem]  WITH CHECK ADD FOREIGN KEY([keyword_id])
    REFERENCES [dbo].[Keyword] ([keyword_id])
    GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_Restaurant] FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_Restaurant]
    GO
ALTER TABLE [dbo].[Order]  WITH CHECK ADD  CONSTRAINT [FK_Order_Status] FOREIGN KEY([status])
    REFERENCES [dbo].[OrderStatus] ([status_id])
    GO
ALTER TABLE [dbo].[Order] CHECK CONSTRAINT [FK_Order_Status]
    GO
ALTER TABLE [dbo].[OrderChosenItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderChosenItem_Item] FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[OrderChosenItem] CHECK CONSTRAINT [FK_OrderChosenItem_Item]
    GO
ALTER TABLE [dbo].[OrderChosenItem]  WITH CHECK ADD  CONSTRAINT [FK_OrderChosenItem_Order] FOREIGN KEY([order_id])
    REFERENCES [dbo].[Order] ([order_id])
    GO
ALTER TABLE [dbo].[OrderChosenItem] CHECK CONSTRAINT [FK_OrderChosenItem_Order]
    GO
ALTER TABLE [dbo].[OrderChosenItemAdditionalDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrderChosenItemAdditionalDetails_Item] FOREIGN KEY([additional_item_id])
    REFERENCES [dbo].[Item] ([item_id])
    GO
ALTER TABLE [dbo].[OrderChosenItemAdditionalDetails] CHECK CONSTRAINT [FK_OrderChosenItemAdditionalDetails_Item]
    GO
ALTER TABLE [dbo].[OrderChosenItemAdditionalDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrderChosenItemAdditionalDetails_OrderChosenItem] FOREIGN KEY([order_chosen_item_id])
    REFERENCES [dbo].[OrderChosenItem] ([order_chosen_item_id])
    GO
ALTER TABLE [dbo].[OrderChosenItemAdditionalDetails] CHECK CONSTRAINT [FK_OrderChosenItemAdditionalDetails_OrderChosenItem]
    GO
ALTER TABLE [dbo].[Section]  WITH CHECK ADD FOREIGN KEY([type])
    REFERENCES [dbo].[SectionType] ([idSectionType])
    GO
ALTER TABLE [dbo].[Section]  WITH CHECK ADD FOREIGN KEY([type])
    REFERENCES [dbo].[SectionType] ([idSectionType])
    GO
ALTER TABLE [dbo].[Section]  WITH CHECK ADD  CONSTRAINT [FK_Section_Restaurant] FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[Section] CHECK CONSTRAINT [FK_Section_Restaurant]
    GO
ALTER TABLE [dbo].[SectionItem]  WITH CHECK ADD  CONSTRAINT [FK_Section_Item] FOREIGN KEY([item_id])
    REFERENCES [dbo].[Item] ([item_id])
    ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SectionItem] CHECK CONSTRAINT [FK_Section_Item]
    GO
ALTER TABLE [dbo].[SectionItem]  WITH CHECK ADD  CONSTRAINT [FK_SectionItem_Aside] FOREIGN KEY([section_id])
    REFERENCES [dbo].[Section] ([section_id])
    ON DELETE CASCADE
GO
ALTER TABLE [dbo].[SectionItem] CHECK CONSTRAINT [FK_SectionItem_Aside]
    GO
ALTER TABLE [dbo].[UserKitchen]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
ALTER TABLE [dbo].[UserKitchen]  WITH CHECK ADD FOREIGN KEY([restaurant_id])
    REFERENCES [dbo].[Restaurant] ([restaurant_id])
    GO
/****** Object:  StoredProcedure [dbo].[ChangeOrderStatus]    Script Date: 18/02/2025 16:24:15 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
CREATE PROCEDURE [dbo].[ChangeOrderStatus]
    @OrderId INT,
    @NewStatus INT
AS
BEGIN

UPDATE [Order]
SET Status = @NewStatus
WHERE order_id = @OrderId;

SELECT
    o.order_id AS OrderId,
    o.username,
    o.status AS Status,
    o.restaurant_id AS RestaurantId,
    o.order_date AS OrderDate
FROM [Order] o
WHERE order_id = @OrderId;
END
GO
/****** Object:  StoredProcedure [dbo].[CreateOrder]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CreateOrder]
    @RestaurantId INT,
    @Username NVARCHAR(255),
	@UserFingerprint NVARCHAR(255),
    @Items NVARCHAR(MAX),
	@TableId Int null,
	@OrderDestination nvarchar(50) null,
    @AdditionalDetails NVARCHAR(MAX),
    @OrderId INT OUTPUT
AS
BEGIN
INSERT INTO [Order] (restaurant_id, username, UserFingerprint, [status], order_date, tableId, OrderDestination)
VALUES (@RestaurantId, @Username, @UserFingerprint, 2, GETUTCDATE(), @TableId, @OrderDestination);

SET @OrderId = SCOPE_IDENTITY();

    DECLARE @ParsedItems TABLE (
        ItemId INT,
        Quantity INT,
        Position INT
    );

INSERT INTO @ParsedItems (ItemId, Quantity, Position)
SELECT
    JSON_VALUE(Item.value, '$.ItemId') AS ItemId,
    JSON_VALUE(Item.value, '$.Quantity') AS Quantity,
    JSON_VALUE(Item.value, '$.Position') AS Position
FROM OPENJSON(@Items) AS Item;

DECLARE @OrderChosenItem TABLE (
        OrderChosenItemId INT,
        ItemId INT,
        Quantity INT,
        Position INT
    );

INSERT INTO OrderChosenItem (order_id, item_id, quantity, position)
    OUTPUT INSERTED.order_chosen_item_id, INSERTED.item_id, INSERTED.quantity, INSERTED.position INTO @OrderChosenItem
SELECT @OrderId, ItemId, Quantity, Position
FROM @ParsedItems;

DECLARE @ParsedAdditionalDetails TABLE (
        OrderChosenItemId INT,
        AdditionalItemId INT,
        Quantity INT,
        PositionItemParent INT
    );

INSERT INTO @ParsedAdditionalDetails (OrderChosenItemId, AdditionalItemId, Quantity, PositionItemParent)
SELECT
    OCI.OrderChosenItemId,
    JSON_VALUE(Detail.value, '$.ItemId') AS AdditionalItemId,
    JSON_VALUE(Detail.value, '$.Quantity') AS Quantity,
    JSON_VALUE(Detail.value, '$.ItemParentPosition') AS PositionItemParent
FROM OPENJSON(@AdditionalDetails) AS Detail
         JOIN @OrderChosenItem OCI
              ON OCI.ItemId = JSON_VALUE(Detail.value, '$.ItemParentId')
                  AND OCI.Position = JSON_VALUE(Detail.value, '$.ItemParentPosition')
WHERE OCI.OrderChosenItemId IS NOT NULL;

INSERT INTO OrderChosenItemAdditionalDetails (order_chosen_item_id, additional_item_id, quantity, positionItemParent)
SELECT OrderChosenItemId, AdditionalItemId, Quantity, PositionItemParent
FROM @ParsedAdditionalDetails;
END;
GO
/****** Object:  StoredProcedure [dbo].[CreateOrUpdateSection]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
AUTOR: CAB
DATE : 11/21/2024
DESCRIPTION: Création ou Modification d'une Section
*/
CREATE PROCEDURE [dbo].[CreateOrUpdateSection]
    @RestaurantId INT,
    @ItemId INT,
    @SectionId INT,
    @Name NVARCHAR(100),  
    @Type INT,
    @ChoiceLimitMax INT,
    @ChoiceLimitMin INT,
    @Position INT
AS
BEGIN
    DECLARE @NewSectionId INT;

    -- Vérifier si la section existe déjà
    IF NOT EXISTS (SELECT 1 FROM [dbo].[Section] WHERE section_id = @SectionId)
BEGIN
        -- ################ Création d'une nouvelle Section ################
INSERT INTO [dbo].[Section] ([restaurant_id], [name], [type], [choiceLimitMax], [choiceLimitMin])
VALUES (@RestaurantId, @Name, @Type, @ChoiceLimitMax, @ChoiceLimitMin);

SET @NewSectionId = SCOPE_IDENTITY();
END
ELSE
BEGIN
        -- Si la section existe déjà, récupération de l'ID
        SET @NewSectionId = @SectionId;

        -- Suppression des relations existantes pour cette section
DELETE FROM [dbo].[ItemSection] WHERE section_id = @NewSectionId AND item_id = @ItemId;
DELETE FROM [dbo].[SectionItem] WHERE section_id = @NewSectionId;

-- Mise à jour des informations de la section
UPDATE [dbo].[Section]
SET
    [name] = @Name,
    [type] = @Type,
    [choiceLimitMax] = @ChoiceLimitMax,
    [choiceLimitMin] = @ChoiceLimitMin
WHERE [section_id] = @NewSectionId;
END

    -- Insertion dans ItemSection uniquement si @ItemId est différent de 0
    IF @ItemId <> 0
BEGIN
INSERT INTO [dbo].[ItemSection] ([item_id], [section_id], [position])
VALUES (@ItemId, @NewSectionId, @Position);
END

    -- Retour de l'ID de la section nouvellement créée ou mise à jour
SELECT @NewSectionId;
END
GO
/****** Object:  StoredProcedure [dbo].[CreateProduct]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
AUTOR: CAB
DATE : 11/15/2024
DESCRIPTION: Création d'un item (de type SIMPLE ou COMPOSE), ainsi que tous les autres composants (Ingredients, Keywords, Categories)
*/
CREATE PROCEDURE [dbo].[CreateProduct]
	@RestaurantId INT,
    @Name NVARCHAR(100),
    @Illustration NVARCHAR(200),
    @Duration INT,
    @Price DECIMAL(10, 2),
    @Status INT = 1, -- ACTIVE, DISABLED, OUT_OF_STOCK
    @Type INT, -- Simple, COMPOSE
    @Ingredients NVARCHAR(MAX), -- JSON or comma-separated string for ingredients
    @Keywords NVARCHAR(MAX), -- JSON or comma-separated string for keywords
    @Categories NVARCHAR(MAX), -- JSON or comma-separated string for categories,
	@SectionId int = null, -- Si le produit à crée est un AsideItem
	@Description NVARCHAR(MAX)
AS
BEGIN
    
	DECLARE @NewItemId INT;

	-- ################ Création du nouvelle Item ################

Insert into [dbo].[Item] ([restaurant_id],[name],[illustration],[type],[duration],[price],[status],[description])
values( @RestaurantId, @Name, @Illustration, @Type, @Duration, @Price, @Status,@Description)

SET @NewItemId = SCOPE_IDENTITY();

IF @NewItemId IS NULL
BEGIN
		THROW 50000, 'Erreur : Erreur lors de la création.', 1;
END

	if @NewItemId is not null
begin

		-- ################ Création des ingrédients s'ils n'existent pas déjà ################

INSERT INTO [dbo].[Ingredient] ([restaurant_id], [name])
SELECT
    @RestaurantId,
    value AS [name]
FROM
    STRING_SPLIT(@Ingredients, ',') AS Ingredients -- Divise @Ingredients en valeurs individuelles
WHERE
    NOT EXISTS (
    SELECT 1
    FROM [dbo].[Ingredient]
    WHERE [restaurant_id] = @RestaurantId
  AND UPPER([name]) = UPPER(value) -- Vérifie l'existence de l'ingrédient (insensible à la casse)
    );

-- ################ Création des keywords s'ils n'existent pas déjà ################ 

INSERT INTO [dbo].[Keyword] ([restaurant_id], [name])
SELECT
    @RestaurantId,
    value AS [name]
FROM
    STRING_SPLIT(@Keywords, ',') AS Keywords -- Divise @Ingredients en valeurs individuelles
WHERE
    NOT EXISTS (
    SELECT 1
    FROM [dbo].[Keyword]
    WHERE [restaurant_id] = @RestaurantId
  AND UPPER([name]) = UPPER(value) -- Vérifie l'existence dU Keywords (insensible à la casse)
    )

-- ################ Création des Catégories s'ils n'existent pas déjà ################ 

INSERT INTO [dbo].[Category] ([restaurant_id], [name])
SELECT
    @RestaurantId,
    value AS [name]
FROM
    STRING_SPLIT(@Categories, ',') AS Categroies -- Divise @Categories en valeurs individuelles
WHERE
    NOT EXISTS (
    SELECT 1
    FROM [dbo].[Category]
    WHERE [restaurant_id] = @RestaurantId
  AND UPPER([name]) = UPPER(value) -- Vérifie l'existence dU Keywords (insensible à la casse)
    )

-- ################ Mapping du nouvelle item avec les Ingredients, Keywords et Categories  ################

-- Ingredient

INSERT INTO [dbo].[ItemIngredient] ([ingredient_id], [item_id])
SELECT
    ingredient_id,
    @NewItemId
FROM
    [dbo].[Ingredient]
WHERE
    [restaurant_id] = @RestaurantId
  AND UPPER([name]) IN (
    SELECT value
    FROM STRING_SPLIT(@Ingredients, ',')
    );

-- Keyword

INSERT INTO [dbo].[KeywordItem] ([keyword_id], [item_id])
SELECT
    [keyword_id],
    @NewItemId
FROM
    [dbo].[Keyword]
WHERE
    [restaurant_id] = @RestaurantId
  AND UPPER([name]) IN (
    SELECT value
    FROM STRING_SPLIT(@Keywords, ',')
    );

-- Category

INSERT INTO [dbo].[ItemCategory] ([category_id], [item_id])
SELECT
    [category_id],
    @NewItemId
FROM
    [dbo].[Category]
WHERE
    [restaurant_id] = @RestaurantId
  AND UPPER([name]) IN (
    SELECT value
    FROM STRING_SPLIT(@Categories, ',')
    );
end

	-- Si l'item crée est un SectionItem, alors on le lie à la section
	if(@SectionId is not null)
begin
INSERT INTO dbo.SectionItem(section_id, item_id)
VALUES(@SectionId,@NewItemId)
end



select @NewItemId

END
GO
/****** Object:  StoredProcedure [dbo].[CreateRestaurantAndAccounts]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[CreateRestaurantAndAccounts]
    @Name NVARCHAR(100),
    @Illustration NVARCHAR(MAX),
    @Address NVARCHAR(100),  
    @Siret NVARCHAR(MAX),
    @Tva NVARCHAR(20),
    @AdministratorId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @IllustrationAdmin NVARCHAR(MAX),
    @Email NVARCHAR(100),
    @PhoneNumber NVARCHAR(15),
    @Password NVARCHAR(MAX),
	@ContractUrl NVARCHAR(MAX),
    @Payment_id NVARCHAR(MAX)
AS
BEGIN
BEGIN TRANSACTION -- Début de la transaction

    DECLARE @NewRestaurantId INT;

BEGIN TRY
        -- Vérification de l'unicité de l'email avant d'insérer les données
IF EXISTS (SELECT 1 FROM [dbo].[Administrator] WHERE [email] = @Email)
BEGIN
            -- Si l'email existe déjà, lever une erreur
            RAISERROR('Cet email existe déjà.', 16, 1);
ROLLBACK TRANSACTION; -- Annuler la transaction
RETURN; -- Sortir de la procédure
END

        -- ################ Création d'un nouveau Restaurant ################
INSERT INTO [dbo].[Restaurant] ([name], [address], [siret], [illustration], [Tva], [payment_id],[ContractUrl])
VALUES (@Name, @Address, @Siret, @Illustration, @Tva, @Payment_id,@ContractUrl);

SET @NewRestaurantId = SCOPE_IDENTITY();

        -- ################ Création du compte Admin ################
INSERT INTO [dbo].[Administrator] (
    [restaurant_id],
    [firstname],
    [lastname],
    [email],
    [phone],
    [password],
[illustration]
)
VALUES (
    @NewRestaurantId,
    @FirstName,
    @LastName,
    @Email,
    @PhoneNumber,
    @Password,
    @IllustrationAdmin
    );

-- Retourne l'ID du nouveau restaurant
SELECT @NewRestaurantId AS NewRestaurantId;

COMMIT TRANSACTION; -- Commit de la transaction si tout a réussi
END TRY

BEGIN CATCH
        -- Gestion des erreurs générales
ROLLBACK TRANSACTION; -- Annuler la transaction en cas d'erreur

        -- Si l'erreur est une violation de contrainte UNIQUE (par exemple, l'email existe déjà)
        IF ERROR_NUMBER() IN (2627, 2601)
BEGIN
            -- Retourne un message d'erreur explicite
            RAISERROR('Cet email existe déjà.', 16, 1);
END
ELSE
BEGIN
            -- Propager l'erreur si ce n'est pas une violation de contrainte UNIQUE
            THROW;
END
END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[GetAllCategoriesFromARestaurant]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllCategoriesFromARestaurant]
    @RestaurantId INT
AS
BEGIN
SELECT
    name AS CategoryName
FROM
    [dbo].[Category]
WHERE
    restaurant_id = @RestaurantId;
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllIngredientsFromARestaurant]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllIngredientsFromARestaurant]
	@RestaurantId INT
AS
BEGIN
SELECT
    name AS IngredientName
FROM
    [dbo].[Ingredient]
WHERE
    restaurant_id = @RestaurantId;
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllKeywordsFromARestaurant]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllKeywordsFromARestaurant]
    @RestaurantId INT
AS
BEGIN
SELECT
    k.name AS KeywordName
FROM
    [dbo].[Keyword] k
WHERE
    k.restaurant_id = @RestaurantId;
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllOrders]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllOrders]
AS
BEGIN
SELECT
    o.order_id AS OrderId,
    o.username,
    o.status AS Status,
    o.restaurant_id AS RestaurantId,
    o.order_date AS OrderDate
FROM [Order] o;

SELECT
    oci.order_chosen_item_id AS orderChosenItemId,
    oci.item_id AS itemId,
    i.name,
    i.illustration,
    i.duration,
    i.price,
    CASE
        WHEN i.type = 2 THEN 'COMPOUND'
        ELSE 'SIMPLE'
        END AS [type],
        oci.quantity,
        oci.order_id AS OrderId,
        oci.position AS Position
FROM OrderChosenItem oci
    JOIN Item i ON oci.item_id = i.item_id
WHERE oci.order_id IN (SELECT order_id FROM [Order]);

SELECT
    ociad.order_chosen_item_id AS orderChosenItemId,
    ociad.additional_item_id AS itemId,
    i.name,
    i.illustration,
    'SIMPLE' AS [type],
        ociad.quantity,
        oci.item_id AS ItemParentId,
        oci.order_id AS OrderId,
        oci.position AS ItemParentPosition,
        i.[description]
FROM OrderChosenItemAdditionalDetails ociad
    JOIN Item i ON ociad.additional_item_id = i.item_id
    JOIN OrderChosenItem oci ON ociad.order_chosen_item_id = oci.order_chosen_item_id
WHERE oci.order_id IN (SELECT order_id FROM [Order]);
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllRestaurants]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetAllRestaurants]
AS
BEGIN
SELECT
    r.restaurant_id AS RestaurantId,
    r.name,
    r.address,
    r.illustration,
    AVG(i.price) AS AveragePrice
FROM Restaurant r
         LEFT JOIN Item i ON r.restaurant_id = i.restaurant_id AND i.isRemoved = 0
WHERE
    r.IsVisible = 1
GROUP BY
    r.restaurant_id,
    r.name,
    r.address,
    r.illustration
ORDER BY r.name;
END
GO
/****** Object:  StoredProcedure [dbo].[GetAllSectionsFromARestaurant]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[GetAllSectionsFromARestaurant]
    @RestaurantId INT,
	@SectionId INT = NULL,
	@Type INT = NULL,
	@Name NVARCHAR(MAX) = NULL
AS
BEGIN
    -- Récupérer toutes les Sections d'un restaurant spécifique
SELECT
    s.section_id AS SectionId,
    s.name AS Name,
    st.type AS Type,
    s.choiceLimitMax AS ChoiceLimitMax,
    s.choiceLimitMin AS ChoiceLimitMin
FROM
    Section s
        INNER JOIN SectionType st ON s.type = st.idSectionType
WHERE
    s.restaurant_id = @RestaurantId
  AND ((@SectionId IS NULL OR s.[section_id] = @SectionId)
    AND (@Name IS NULL OR s.[name] LIKE '%' + @Name + '%')
    AND (@Type IS NULL OR s.[type] = @Type));

-- Récupérer les Items associés aux Sections d'un restaurant spécifique
SELECT
    si.section_id AS SectionId,
    i.item_id AS ItemId,
    i.duration AS Duration,
    i.status AS Status,
    i.restaurant_id AS RestaurantId,
    i.type AS Type,
    i.name AS Name,
    i.price AS Price,
    i.illustration AS Illustration,
    i.description AS Description,
    (SELECT STRING_AGG(ing.name, ',')
     FROM (SELECT DISTINCT ing.name
           FROM [dbo].[ItemIngredient] ii
               INNER JOIN [dbo].[Ingredient] ing ON ing.ingredient_id = ii.ingredient_id
           WHERE ii.item_id = i.item_id) AS ing) AS IngredientsString,
    (SELECT STRING_AGG(cat.name, ',')
     FROM (SELECT DISTINCT cat.name
           FROM [dbo].[ItemCategory] ic
               INNER JOIN [dbo].[Category] cat ON cat.category_id = ic.category_id
           WHERE ic.item_id = i.item_id) AS cat) AS CategoriesString,
    (SELECT STRING_AGG(kw.name, ',')
     FROM (SELECT DISTINCT kw.name
           FROM [dbo].[KeywordItem] ik
               INNER JOIN [dbo].[Keyword] kw ON kw.keyword_id = ik.keyword_id
           WHERE ik.item_id = i.item_id) AS kw) AS KeywordsString
FROM
    SectionItem si
        INNER JOIN Item i ON si.item_id = i.item_id
WHERE
    i.restaurant_id = @RestaurantId
GROUP BY
    i.item_id, i.restaurant_id, i.name, i.illustration, i.[duration], i.price, si.section_id, i.status, i.type, i.description;
END
GO
/****** Object:  StoredProcedure [dbo].[GetItemById]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetItemById]
    @ItemId INT
AS
BEGIN
    -- Sélection principale pour l'item
SELECT
    i.item_id AS ItemId,
    i.restaurant_id AS RestaurantId,
    i.name AS Name,
    i.illustration AS Illustration,
    it.type AS Type,
    i.[duration] AS Duration,
    i.price AS Price,
    i.[description],
    s.status AS Status,
    (SELECT STRING_AGG(ing.name, ',')
     FROM (SELECT DISTINCT ing.name
           FROM [dbo].[ItemIngredient] ii
               INNER JOIN [dbo].[Ingredient] ing ON ing.ingredient_id = ii.ingredient_id
           WHERE ii.item_id = i.item_id) AS ing) AS IngredientsString,
    (SELECT STRING_AGG(cat.name, ',')
     FROM (SELECT DISTINCT cat.name
           FROM [dbo].[ItemCategory] ic
               INNER JOIN [dbo].[Category] cat ON cat.category_id = ic.category_id
           WHERE ic.item_id = i.item_id) AS cat) AS CategoriesString,
    (SELECT STRING_AGG(kw.name, ',')
     FROM (SELECT DISTINCT kw.name
           FROM [dbo].[KeywordItem] ik
               INNER JOIN [dbo].[Keyword] kw ON kw.keyword_id = ik.keyword_id
           WHERE ik.item_id = i.item_id) AS kw) AS KeywordsString
FROM
    Item i
        INNER JOIN ItemStatus s ON i.[status] = s.idItemStatus
        INNER JOIN [dbo].[ItemType] it ON it.idItemType = i.[type]
WHERE
    i.item_id = @ItemId
  AND i.isRemoved = 0
GROUP BY
    i.item_id, i.restaurant_id, i.name, i.illustration, it.type, i.[duration], i.price, s.status,i.[description];

-- Récupérer les Sections (associées à l'item)
SELECT
    i.item_id AS ItemId,
    s.section_id AS SectionId,
    s.name AS Name,
    st.type AS Type,
    s.choiceLimitMax AS ChoiceLimitMax,
    s.choiceLimitMin AS ChoiceLimitMin,
    its.position AS Position,
		i.[description]
FROM
    Item i
    INNER JOIN ItemSection its ON i.item_id = its.item_id
    INNER JOIN Section s ON its.section_id = s.section_id
    INNER JOIN SectionType st ON s.type = st.idSectionType
WHERE
    i.item_id = @ItemId order by Position;

-- Récupérer les Items associés aux Sections
SELECT
    s.section_id AS SectionId,
    i.item_id AS ItemId,
    i.duration AS Duration,
    i.status AS Status,
    i.restaurant_id AS RestaurantId,
    i.type AS Type,
    i.name AS Name,
    i.price AS Price,
    i.[description],
    i.illustration AS Illustration,
    (SELECT STRING_AGG(ing.name, ',')
     FROM (SELECT DISTINCT ing.name
           FROM [dbo].[ItemIngredient] ii
               INNER JOIN [dbo].[Ingredient] ing ON ing.ingredient_id = ii.ingredient_id
           WHERE ii.item_id = i.item_id) AS ing) AS IngredientsString,
    (SELECT STRING_AGG(cat.name, ',')
     FROM (SELECT DISTINCT cat.name
           FROM [dbo].[ItemCategory] ic
               INNER JOIN [dbo].[Category] cat ON cat.category_id = ic.category_id
           WHERE ic.item_id = i.item_id) AS cat) AS CategoriesString,
    (SELECT STRING_AGG(kw.name, ',')
     FROM (SELECT DISTINCT kw.name
           FROM [dbo].[KeywordItem] ik
               INNER JOIN [dbo].[Keyword] kw ON kw.keyword_id = ik.keyword_id
           WHERE ik.item_id = i.item_id) AS kw) AS KeywordsString
FROM
    SectionItem s
        INNER JOIN Item i ON s.item_id = i.item_id
GROUP BY
    i.item_id, i.restaurant_id, i.name, i.illustration, i.[duration], i.price, s.section_id, i.status, i.type,i.[description];
END
GO
/****** Object:  StoredProcedure [dbo].[GetItemsFromARestaurant]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetItemsFromARestaurant]
    @RestaurantId INT,
    @Ingredients NVARCHAR(MAX) = NULL,
    @Duration INT = NULL,
    @MinPrice DECIMAL(18, 2) = NULL,
    @MaxPrice DECIMAL(18, 2) = NULL,
    @Type INT = NULL,
    @Categories NVARCHAR(MAX) = NULL
AS
BEGIN
    -- Sélection principale pour les items
SELECT
    i.item_id AS ItemId,
    i.restaurant_id AS RestaurantId,
    i.name AS Name,
    i.illustration AS Illustration,
    it.type AS Type,
    i.[duration] AS Duration,
    i.price AS Price,
    s.status AS Status,
    i.[description],
    (SELECT STRING_AGG(ing.name, ',')
     FROM (SELECT DISTINCT ing.name
           FROM [dbo].[ItemIngredient] ii
               INNER JOIN [dbo].[Ingredient] ing ON ing.ingredient_id = ii.ingredient_id
           WHERE ii.item_id = i.item_id) AS ing) AS IngredientsString,
    (SELECT STRING_AGG(cat.name, ',')
     FROM (SELECT DISTINCT cat.name
           FROM [dbo].[ItemCategory] ic
               INNER JOIN [dbo].[Category] cat ON cat.category_id = ic.category_id
           WHERE ic.item_id = i.item_id) AS cat) AS CategoriesString,
    (SELECT STRING_AGG(kw.name, ',')
     FROM (SELECT DISTINCT kw.name
           FROM [dbo].[KeywordItem] ik
               INNER JOIN [dbo].[Keyword] kw ON kw.keyword_id = ik.keyword_id
           WHERE ik.item_id = i.item_id) AS kw) AS KeywordsString
FROM
    Item i
        INNER JOIN ItemStatus s ON i.[status] = s.idItemStatus
        INNER JOIN [dbo].[ItemType] it ON it.idItemType = i.[type]
    LEFT JOIN [dbo].[ItemDuration] id ON @Duration IS NOT NULL AND id.IdItemDuration = @Duration
WHERE
    i.restaurant_id = @RestaurantId
  AND ((@Type IS NULL OR i.[type] = @Type)
  AND (@Duration IS NULL OR i.duration <= id.Duration)
  AND (@MinPrice IS NULL OR i.price >= @MinPrice)
  AND (@MaxPrice IS NULL OR i.price <= @MaxPrice)
  AND (@Ingredients IS NULL OR EXISTS (
    SELECT 1
    FROM [dbo].[ItemIngredient] ii
    INNER JOIN [dbo].[Ingredient] ing ON ing.ingredient_id = ii.ingredient_id
    WHERE ii.item_id = i.item_id AND ing.name IN (SELECT value FROM STRING_SPLIT(@Ingredients, ','))
    ))
  AND (@Categories IS NULL OR EXISTS (
    SELECT 1
    FROM [dbo].[ItemCategory] ic
    INNER JOIN [dbo].[Category] cat ON cat.category_id = ic.category_id
    WHERE ic.item_id = i.item_id AND cat.name IN (SELECT value FROM STRING_SPLIT(@Categories, ','))
    )))
  AND i.isRemoved = 0
GROUP BY
    i.item_id, i.restaurant_id, i.name, i.illustration, it.type, i.[duration], i.price, s.status, i.[description];

-- Récupérer les Sections (associées aux items composés) si le type est compound (2)
IF @Type IS NULL OR @Type = 2
BEGIN
SELECT
    i.item_id AS ItemId,
    s.section_id AS SectionId,
    s.name AS Name,
    st.type AS Type,
    s.choiceLimitMax AS ChoiceLimitMax,
    s.choiceLimitMin AS ChoiceLimitMin,
    its.position AS Position
FROM
    Item i
    INNER JOIN ItemSection its ON i.item_id = its.item_id
    INNER JOIN Section s ON its.section_id = s.section_id
    INNER JOIN SectionType st ON s.type = st.idSectionType
WHERE
    i.restaurant_id = @RestaurantId;

-- Récupérer les Items associés aux Sections
SELECT
    s.section_id AS SectionId,
    i.item_id AS ItemId,
    i.duration AS Duration,
    i.status AS Status,
    i.restaurant_id AS RestaurantId,
    i.type AS Type,
    i.name AS Name,
    i.price AS Price,
    i.illustration AS Illustration,
    i.[description],
    (SELECT STRING_AGG(ing.name, ',')
     FROM (SELECT DISTINCT ing.name
           FROM [dbo].[ItemIngredient] ii
               INNER JOIN [dbo].[Ingredient] ing ON ing.ingredient_id = ii.ingredient_id
           WHERE ii.item_id = i.item_id) AS ing) AS IngredientsString,
    (SELECT STRING_AGG(cat.name, ',')
     FROM (SELECT DISTINCT cat.name
           FROM [dbo].[ItemCategory] ic
               INNER JOIN [dbo].[Category] cat ON cat.category_id = ic.category_id
           WHERE ic.item_id = i.item_id) AS cat) AS CategoriesString,
    (SELECT STRING_AGG(kw.name, ',')
     FROM (SELECT DISTINCT kw.name
           FROM [dbo].[KeywordItem] ik
               INNER JOIN [dbo].[Keyword] kw ON kw.keyword_id = ik.keyword_id
           WHERE ik.item_id = i.item_id) AS kw) AS KeywordsString
FROM
    SectionItem s
        INNER JOIN Item i ON s.item_id = i.item_id
WHERE
    s.item_id IN (SELECT item_id FROM Item WHERE restaurant_id = @RestaurantId)
GROUP BY
    i.item_id, i.restaurant_id, i.name, i.illustration, i.[duration], i.price, s.section_id, i.status, i.type, i.[description];
END
END
GO
/****** Object:  StoredProcedure [dbo].[GetOrdersByRestaurantId]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetOrdersByRestaurantId]
    @RestaurantId INT
AS
BEGIN
SELECT
    o.order_id AS OrderId,
    o.username,
    o.status AS Status,
    o.restaurant_id AS RestaurantId,
    o.order_date AS OrderDate,
    o.UserFingerprint,
    o.TableId,
    o.OrderDestination,
    o.payment_price AS PaymentPrice

FROM [Order] o
WHERE o.restaurant_id = @RestaurantId order by order_id desc;

SELECT
    oci.order_chosen_item_id AS orderChosenItemId,
    oci.item_id AS itemId,
    i.name,
    i.illustration,
    i.duration,
    i.[description],
    i.price,
    CASE
        WHEN i.type = 2 THEN 'COMPOUND'
        ELSE 'SIMPLE'
        END AS [type],
        oci.quantity,
        oci.order_id AS OrderId,
        oci.position AS Position
FROM OrderChosenItem oci
    JOIN Item i ON oci.item_id = i.item_id
WHERE oci.order_id IN (SELECT order_id FROM [Order] WHERE restaurant_id = @RestaurantId);

SELECT
    ociad.order_chosen_item_id AS orderChosenItemId,
    ociad.additional_item_id AS itemId,
    i.name,
    i.[description],
    i.illustration,
    'SIMPLE' AS [type],
        ociad.quantity,
        oci.item_id AS ItemParentId,
        oci.order_id AS OrderId,
        oci.position AS ItemParentPosition
FROM OrderChosenItemAdditionalDetails ociad
    JOIN Item i ON ociad.additional_item_id = i.item_id
    JOIN OrderChosenItem oci ON ociad.order_chosen_item_id = oci.order_chosen_item_id
WHERE oci.order_id IN (SELECT order_id FROM [Order] WHERE restaurant_id = @RestaurantId);
END
GO
/****** Object:  StoredProcedure [dbo].[GetRestaurantById]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetRestaurantById]
    @RestaurantId INT
AS
BEGIN
SELECT
    r.restaurant_id AS RestaurantId,
    r.name,
    r.address,
    r.siret,
    r.illustration,
    r.tva,
    r.isVisible,
    AVG(i.price) AS AveragePrice
FROM [Restaurant] r
    LEFT JOIN [Item] i ON r.restaurant_id = i.restaurant_id AND i.isRemoved = 0
WHERE r.restaurant_id = @RestaurantId
GROUP BY
    r.restaurant_id,
    r.name,
    r.address,
    r.siret,
    r.illustration,
    r.tva,
    r.IsVisible;
END
GO
/****** Object:  StoredProcedure [dbo].[GetSalesAndRevenueModel]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetSalesAndRevenueModel]
    @RestaurantId INT,
    @FromDate Date
AS
BEGIN

SELECT
    i.price * oc.quantity as price ,
    o.order_date AS OrderDate,
    o.username
FROM
    [Order] o
    INNER JOIN [OrderChosenItem] oc ON o.order_id = oc.order_id
    INNER JOIN [Item] i ON i.item_id = oc.item_id
WHERE
    o.order_date >= CONVERT(DATE, @FromDate, 110)
  AND o.restaurant_id = @RestaurantId and o.[status] in (1,3,5)
END
GO
/****** Object:  StoredProcedure [dbo].[RemoveItem]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[RemoveItem]
    @ItemId INT
AS
BEGIN
    -- Début de la transaction
BEGIN TRANSACTION;

BEGIN TRY
        -- Suppression des références dans les tables associées
DELETE FROM ItemCategory WHERE item_id = @ItemId;
DELETE FROM ItemIngredient WHERE item_id = @ItemId;
DELETE FROM ItemSection WHERE item_id = @ItemId;
DELETE FROM KeywordItem WHERE item_id = @ItemId;
DELETE FROM SectionItem WHERE item_id = @ItemId;

-- Mise à jour de la colonne isRemoved à true
UPDATE Item
SET isRemoved = 1
WHERE item_id = @ItemId;

-- Suppression des catégories non référencées
DELETE FROM Category
WHERE category_id NOT IN (SELECT category_id FROM ItemCategory);

-- Suppression des ingrédients non référencés
DELETE FROM Ingredient
WHERE ingredient_id NOT IN (SELECT ingredient_id FROM ItemIngredient);

-- Suppression des mots-clés non référencés
DELETE FROM Keyword
WHERE keyword_id NOT IN (SELECT keyword_id FROM KeywordItem);

-- Suppression des sections non référencées dans ItemSection et SectionItem
DELETE FROM Section
WHERE section_id NOT IN (SELECT section_id FROM ItemSection)
  AND section_id NOT IN (SELECT section_id FROM SectionItem);

-- Validation de la transaction
COMMIT TRANSACTION;
END TRY
BEGIN CATCH
        -- Annulation de la transaction en cas d'erreur
ROLLBACK TRANSACTION;

        -- Renvoyer l'erreur
        THROW;
END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[RemoveOldSectionsFromCompoundItem]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[RemoveOldSectionsFromCompoundItem]
    @ItemId INT,
    @SectionIds NVARCHAR(MAX)
AS
BEGIN

    -- Convertir la liste des SectionIds en table
    DECLARE @SectionIdsTable TABLE (SectionId INT);
INSERT INTO @SectionIdsTable (SectionId)
SELECT value FROM STRING_SPLIT(@SectionIds, ',');

-- Supprimer les relations dans ItemSection
DELETE FROM [ItemSection]
WHERE item_id = @ItemId
  AND section_id NOT IN (SELECT SectionId FROM @SectionIdsTable);
END


GO
/****** Object:  StoredProcedure [dbo].[RemoveSection]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[RemoveSection]
    @SectionId INT
AS
BEGIN
    -- Début de la transaction
BEGIN TRANSACTION;

BEGIN TRY
        -- Suppression des références dans les tables associées
DELETE FROM ItemSection WHERE section_id = @SectionId;
DELETE FROM SectionItem WHERE section_id = @SectionId;

-- Suppression de la section dans la table Section
DELETE FROM Section WHERE section_id = @SectionId;

-- Validation de la transaction
COMMIT TRANSACTION;
END TRY
BEGIN CATCH
        -- Annulation de la transaction en cas d'erreur
ROLLBACK TRANSACTION;

        -- Renvoyer l'erreur
        THROW;
END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[UpdateProduct]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
AUTOR: CAB
DATE : 11/21/2024
DESCRIPTION: Modification d'un item (de type SIMPLE ou COMPOSE), ainsi que tous les autres composants (Ingredients, Keywords, Categories)
*/
CREATE PROCEDURE [dbo].[UpdateProduct]
	@RestaurantId INT,
    @Name NVARCHAR(100),
	@ItemId int,
    @Illustration NVARCHAR(200),
    @Duration INT,
    @Price DECIMAL(10, 2),
    @Status INT = 1, -- ACTIVE, DISABLED, OUT_OF_STOCK
    @Type INT, -- Simple, COMPOSE
    @Ingredients NVARCHAR(MAX), -- JSON or comma-separated string for ingredients
    @Keywords NVARCHAR(MAX), -- JSON or comma-separated string for keywords
    @Categories NVARCHAR(MAX), -- JSON or comma-separated string for categories
	@SectionId int,
	@Description nvarchar(max)
AS
BEGIN

UPDATE [dbo].[Item]
SET
    [restaurant_id] = @RestaurantId,
    [name] = @Name,
    [illustration] = @Illustration,
    [type] = @Type,
    [duration] = @Duration,
    [price] = @Price,
    [status] = @Status,
    [description] = @Description
WHERE item_id = @ItemId AND isRemoved = 0;

-- Suppresion de toutes les Ingredient, Keyword et Categorie liée à l'item, pour les lier avec les nouveaux
Delete from [dbo].[ItemIngredient] where item_id = @ItemId
Delete from  [dbo].[KeywordItem] where item_id = @ItemId
Delete from [dbo].[ItemCategory]  where item_id = @ItemId

-- ################ Création des ingrédients s'ils n'existent pas déjà ################

INSERT INTO [dbo].[Ingredient] ([restaurant_id], [name])
SELECT
    @RestaurantId,
    value AS [name]
FROM
    STRING_SPLIT(@Ingredients, ',') AS Ingredients -- Divise @Ingredients en valeurs individuelles
WHERE
    NOT EXISTS (
    SELECT 1
    FROM [dbo].[Ingredient]
    WHERE [restaurant_id] = @RestaurantId
  AND UPPER([name]) = UPPER(value) -- Vérifie l'existence de l'ingrédient (insensible à la casse)
    );

-- ################ Création des keywords s'ils n'existent pas déjà ################ 

INSERT INTO [dbo].[Keyword] ([restaurant_id], [name])
SELECT
    @RestaurantId,
    value AS [name]
FROM
    STRING_SPLIT(@Keywords, ',') AS Keywords -- Divise @Ingredients en valeurs individuelles
WHERE
    NOT EXISTS (
    SELECT 1
    FROM [dbo].[Keyword]
    WHERE [restaurant_id] = @RestaurantId
  AND UPPER([name]) = UPPER(value) -- Vérifie l'existence dU Keywords (insensible à la casse)
    )

-- ################ Création des Catégories s'ils n'existent pas déjà ################ 

INSERT INTO [dbo].[Category] ([restaurant_id], [name])
SELECT
    @RestaurantId,
    value AS [name]
FROM
    STRING_SPLIT(@Categories, ',') AS Categroies -- Divise @Categories en valeurs individuelles
WHERE
    NOT EXISTS (
    SELECT 1
    FROM [dbo].[Category]
    WHERE [restaurant_id] = @RestaurantId
  AND UPPER([name]) = UPPER(value) -- Vérifie l'existence dU Keywords (insensible à la casse)
    )

-- ################ Mapping du nouvelle item avec les Ingredients, Keywords et Categories  ################

-- Ingredient

INSERT INTO [dbo].[ItemIngredient] ([ingredient_id], [item_id])
SELECT
    ingredient_id,
    @ItemId
FROM
    [dbo].[Ingredient]
WHERE
    [restaurant_id] = @RestaurantId
  AND UPPER([name]) IN (
    SELECT value
    FROM STRING_SPLIT(@Ingredients, ',')
    );

-- Keyword

INSERT INTO [dbo].[KeywordItem] ([keyword_id], [item_id])
SELECT
    [keyword_id],
    @ItemId
FROM
    [dbo].[Keyword]
WHERE
    [restaurant_id] = @RestaurantId
  AND UPPER([name]) IN (
    SELECT value
    FROM STRING_SPLIT(@Keywords, ',')
    );

-- Category

INSERT INTO [dbo].[ItemCategory] ([category_id], [item_id])
SELECT
    [category_id],
    @ItemId
FROM
    [dbo].[Category]
WHERE
    [restaurant_id] = @RestaurantId
  AND UPPER([name]) IN (
    SELECT value
    FROM STRING_SPLIT(@Categories, ',')
    );

-- Si l'item modifié est un SectionItem, alors on le lie à la section
if(@SectionId is not null)
begin

INSERT INTO dbo.SectionItem(section_id, item_id)
VALUES(@SectionId,@ItemId)
end

select @ItemId

END
GO
/****** Object:  StoredProcedure [dbo].[UpdateRestaurantAndAccounts]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
AUTOR: CAB
DATE : 11/26/2024
DESCRIPTION: Modification des info des restaurants et de ses comptes
*/
CREATE PROCEDURE [dbo].[UpdateRestaurantAndAccounts]
    @RestaurantId INT,
    @Name NVARCHAR(100),
    @Illustration NVARCHAR(MAX),
    @Address NVARCHAR(100),  
    @Siret NVARCHAR(MAX),
    @Tva NVARCHAR(20),
    @AdministratorId INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @IllustrationAdmin NVARCHAR(MAX),
    @Email NVARCHAR(100),
    @PhoneNumber NVARCHAR(15),
    @Password NVARCHAR(MAX)
AS
BEGIN


    -- ################ Modification des infos du Restaurant ################

UPDATE [dbo].Restaurant
SET [name] = @Name,
    [address] = @Address,
    [siret] = @Siret,
    [illustration] = @Illustration,
    [tva] = @Tva
where restaurant_id = @RestaurantId

-- ################ Modification des infos de l'ADMIN ################

UPDATE [dbo].[Administrator]
SET
    [firstname] = @FirstName,
    [lastname] = @LastName,
    [email] = @Email,
    [phone] = @PhoneNumber,
    -- [password] = @Password,   !! L'update de password ce fait sur un autre enpoint !          
    [illustration] = @IllustrationAdmin
WHERE
    [restaurant_id] = @RestaurantId -- and administrator_id=@AdministratorId;   !! A corriger si plusiuers Type de User

Select  @RestaurantId
END


GO
/****** Object:  StoredProcedure [dbo].[UserAuthentification]    Script Date: 18/02/2025 16:24:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
/*
AUTOR: CAB
DATE : 11/26/2024
DESCRIPTION: Authentification d'un user avec les informations du restaurant
*/
CREATE PROCEDURE [dbo].[UserAuthentification]
    @email nvarchar(max)
AS
BEGIN
SELECT
    a.[administrator_id] AS AdministratorId,
    a.[restaurant_id] AS RestaurantId,
    a.[firstname],
    a.[lastname],
    a.[email],
    a.[phone],
    a.[Illustration],
    a.[password],
    'ADMIN' AS [Role],
        r.[name] AS RestaurantName,
        r.[address] AS RestaurantAddress,
		r.Illustration AS RestaurantPicture,
		r.siret AS RestaurantSiret,
		r.Tva AS RestaurantTva
FROM [dbo].[Administrator] a
    LEFT JOIN [dbo].[Restaurant] r ON a.restaurant_id = r.restaurant_id
WHERE a.email = UPPER(@email);
END
GO