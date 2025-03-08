 IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Restaurant]'))
BEGIN
   select 1 
   return
END
	select 0 