using Microsoft.AspNetCore.Mvc;
using smart_meal_paiement_service.Models;
using smart_meal_paiement_service.Services;
using smart_meal_paiement_service.Utils;
using System.Data;

namespace smart_meal_paiement_service.Controllers;

[ApiController]
[Route("api/[controller]")]

public class PaiementController : ControllerBase
{
    private readonly IPaiementService _paiementService;

    public PaiementController(IPaiementService paiementService)
    {
        _paiementService = paiementService;
    }

    [HttpPost("create")]
    public async Task<ActionResult<PaymentResponse>> CreatePaymentAsync([FromBody] PaymentRequest request)
    {
        var response = await _paiementService.CreatePaymentAsync(request);
        return Ok(response);  
    }

    [HttpPost("confirm")]
    public async Task<ActionResult<PaymentResponse>> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
    {
        var parmentResponse = this._paiementService.ConfirmPaymentAsync(request);
        if (request == null)
        {
            return BadRequest(new PaymentResponse
            {
                Error = "La confirmation du paiement a échoué"
            });
        }
        return Ok(parmentResponse);
    }
}
