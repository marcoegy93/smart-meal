using System.Net.Mail;
using System.Net;
using smart_meal_back.IServices;
using smart_meal_back.Contracts;
using System.Net.Mime;
using QRCoder;

namespace smart_meal_back.Services
{
    public class MailSender: IMailSender
    {
        private readonly string smtpHost;
        private readonly int smtpPort;
        private readonly string smtpPassword;
        private readonly string senderEmail;

        public MailSender()
        {
            var envSmtpPassword = Environment.GetEnvironmentVariable("SMTP_PASSWORD_SMART_MEAL");
            smtpHost = "smtp.gmail.com";
            smtpPort = 587;
            smtpPassword = envSmtpPassword != null ? envSmtpPassword : throw new Exception("Env variable SMTP_PASSWORD_SMART_MEAL is not set.");
            senderEmail = "footballlegendary08@gmail.com";
        }

        public async Task SendRestaurantCreationMail(string emailDestinataire, Restaurant restaurant)
        {
            try
            {
                using (var client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.Credentials = new NetworkCredential(senderEmail, smtpPassword);
                    client.EnableSsl = true;
                    var message = new MailMessage
                    {
                        From = new MailAddress(senderEmail),
                        Subject = $"Votre restaurant {restaurant.Name} est disponible sur Smart Meal !",
                        IsBodyHtml = true
                    };

                    // Ajout du logo
                    string logoAbsolutePath = Path.GetFullPath(Path.Combine("Pictures", "Logo.png"));
                    if (File.Exists(logoAbsolutePath))
                    {
                        var logo = new Attachment(logoAbsolutePath);
                        logo.ContentId = "logo";
                        logo.ContentDisposition.Inline = true;
                        logo.ContentDisposition.DispositionType = DispositionTypeNames.Inline;
                        message.Attachments.Add(logo);
                    }

                    // Génération du QR Code
                    QRCodeGenerator qrGenerator = new QRCodeGenerator();
                    QRCodeData qrCodeData = qrGenerator.CreateQrCode("https://smartmeal.fr/customer/restaurant?restaurantId="+restaurant.RestaurantId, QRCodeGenerator.ECCLevel.Q);
                    PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
                    byte[] qrCodeBytes = qrCode.GetGraphic(20);

                    // Création de l'attachment pour le QR Code
                    using (var ms = new MemoryStream(qrCodeBytes))
                    {
                        var qrCodeAttachment = new Attachment(ms, "QRCode.png", "image/png");
                        qrCodeAttachment.ContentId = "qrCode";
                        qrCodeAttachment.ContentDisposition.Inline = true;
                        qrCodeAttachment.ContentDisposition.DispositionType = DispositionTypeNames.Inline;
                        message.Attachments.Add(qrCodeAttachment);

                        // Téléchargement du fichier depuis Firebase
                        if (!string.IsNullOrEmpty(restaurant.ContractUrl))
                        {
                            using (var httpClient = new HttpClient())
                            {
                                try
                                {
                                    var fileBytes = await httpClient.GetByteArrayAsync(restaurant.ContractUrl);
                                    var contractStream = new MemoryStream(fileBytes);
                                    var contractAttachment = new Attachment(contractStream, "Contract.pdf", "application/pdf");
                                    message.Attachments.Add(contractAttachment);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Erreur lors du téléchargement du fichier Firebase : {ex.Message}");
                                    throw;
                                }
                            }
                        }

                        // Lecture et remplacement du template
                        string templateAbsolutePath = Path.GetFullPath(Path.Combine("MailTemplates", "RestaurantCreation.html"));
                        string body = await File.ReadAllTextAsync(templateAbsolutePath);
                        body = body.Replace("{{FirstName}}", restaurant.Admin.FirstName)
                                  .Replace("{{LastName}}", restaurant.Admin.LastName)
                                  .Replace("{{RestaurantName}}", restaurant.Name);

                        message.Body = body;
                        message.To.Add(emailDestinataire);

                        // Envoi de l'email
                        client.Send(message);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur lors de l'envoi de l'email : {ex.Message}");
                throw;
            }
        }

    }
}
