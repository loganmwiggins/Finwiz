using Finwiz.Server.Data;
using Finwiz.Server.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        // Get All Accounts
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllAccounts()
        {
            try
            {
                var accounts = await _db.Accounts.ToListAsync();
                return Ok(accounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching accounts.", error = ex.Message });
            }
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
                StatementDay = accountDTO.StatementDay,
                PaymentDay = accountDTO.PaymentDay,
                DueDay = accountDTO.DueDay,
                IsAutopayOn = accountDTO.IsAutopayOn,
                AnnualFee = accountDTO.AnnualFee,
                FeeMonth = accountDTO.FeeMonth,
                FeeDay = accountDTO.FeeDay,
                ImagePath = accountDTO.ImagePath,
                Notes = accountDTO.Notes,
                APY = accountDTO.APY
            };

            _db.Accounts.Add(newAccount);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccountById), new { id = newAccount.Id }, newAccount);
        }

        // Update Account
        [HttpPut("Update/{accountId}")]
        public async Task<IActionResult> UpdateAccount(Guid accountId, [FromBody] CreateAccountDTO updatedAccount)
        {
            if (updatedAccount == null)
            {
                return BadRequest("Invalid account data.");
            }

            var account = await _db.Accounts.FindAsync(accountId);
            if (account == null)
            {
                return NotFound("Account not found.");
            }

            // Update fields
            account.Type = updatedAccount.Type;
            account.Name = updatedAccount.Name;
            account.Provider = updatedAccount.Provider;
            account.CreditLimit = updatedAccount.CreditLimit;
            account.StatementDay = updatedAccount.StatementDay;
            account.PaymentDay = updatedAccount.PaymentDay;
            account.DueDay = updatedAccount.DueDay;
            account.IsAutopayOn = updatedAccount.IsAutopayOn;
            account.AnnualFee = updatedAccount.AnnualFee;
            account.FeeMonth = updatedAccount.FeeMonth;
            account.FeeDay = updatedAccount.FeeDay;
            account.ImagePath = updatedAccount.ImagePath;
            account.Notes = updatedAccount.Notes;
            account.APY = updatedAccount.APY;

            try
            {
                await _db.SaveChangesAsync();
                return Ok(new { message = "Account updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating account: {ex.Message}");
            }
        }

        [HttpDelete("{accountId}")]
        public async Task<IActionResult> DeleteAccount(Guid accountId)
        {
            var account = await _db.Accounts.FindAsync(accountId);

            if (account == null)
                return NotFound("Account not found.");

            _db.Accounts.Remove(account);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}