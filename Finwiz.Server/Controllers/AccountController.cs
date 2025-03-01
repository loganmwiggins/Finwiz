using Finwiz.Server.Data;
using Finwiz.Server.Data.Models;
using Microsoft.AspNetCore.Mvc;
using static Finwiz.Server.Data.DTOs.AccountDTOs;

namespace Finwiz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(ILogger<AccountController> logger, AppDbContext dbContext) : Controller
    {
        private readonly ILogger<AccountController> _logger;
        private readonly AppDbContext _db = dbContext;

        // Get Account by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(Guid id)
        {
            var account = await _db.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound(new { message = "Account not found." });
            }

            return Ok(account);
        }



        // Create Account
        [HttpPost("Create")]
        public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDTO accountDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newAccount = new Account
            {
                Name = accountDTO.Name,
                Provider = accountDTO.Provider,
                Type = accountDTO.Type,
                CreditLimit = accountDTO.CreditLimit,
                StatementDate = accountDTO.StatementDate,
                PaymentDate = accountDTO.PaymentDate,
                DueDate = accountDTO.DueDate,
                IsAutopayOn = accountDTO.IsAutopayOn,
                AnnualFee = accountDTO.AnnualFee,
                FeeDate = accountDTO.FeeDate,
                ImagePath = accountDTO.ImagePath,
                Notes = accountDTO.Notes,
                APY = accountDTO.APY
            };

            _db.Accounts.Add(newAccount);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccountById), new { id = newAccount.Id }, newAccount);
        }
    }
}