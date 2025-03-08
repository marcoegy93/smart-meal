-- Vérifier si la base de données 'smartmealdata' existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'smartmealdata')
BEGIN
    -- Créer la base de données 'smartmealdata' si elle n'existe pas
    CREATE DATABASE smartmealdata;
    PRINT 'Base de données smartmealdata créée.';
END
ELSE
BEGIN
    PRINT 'La base de données smartmealdata existe déjà.';
END
