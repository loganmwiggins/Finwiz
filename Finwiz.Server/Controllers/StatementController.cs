using Finwiz.Server.Data;
using Finwiz.Server.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Finwiz.Server.Data.DTOs.StatementDTOs;

namespace Finwiz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatementController(ILogger<StatementController> logger, AppDbContext dbContext) : Controller
    {
        private readonly ILogger<StatementController> _logger;
        private readonly AppDbContext _db = dbContext;

        // Get all statements for certain account
        [HttpGet("{accountId}")]
        public async Task<IActionResult> GetStatementsByAccount(Guid accountId)
        {
            var statements = await _db.Statements
                .Where(s => s.AccountId == accountId)
                .OrderByDescending(s => s.StatementStart)
                .ToListAsync();

            return Ok(statements);
        }

        // Get latest statement for certain account
        [HttpGet("Latest/{accountId}")]
        public async Task<IActionResult> GetLatestStatement(Guid accountId)
        {
            var latestStatement = await _db.Statements
                .Where(s => s.AccountId == accountId)
                .OrderByDescending(s => s.StatementStart)
                .FirstOrDefaultAsync(); // Get the most recent statement

            if (latestStatement == null)
                return Ok(null);

            return Ok(latestStatement);
        }

        // Create statement
        [HttpPost("{accountId}")]
        public async Task<IActionResult> CreateStatement(Guid accountId, [FromBody] CreateStatementDTO statementDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newStatement = new Statement
            {
                AccountId = accountId,
                Amount = statementDTO.Amount,
                StatementStart = statementDTO.StatementStart,
                StatementEnd = statementDTO.StatementEnd,
                PaymentDate = statementDTO.PaymentDate,
                DueDate = statementDTO.DueDate,
                IsPaid = statementDTO.IsPaid
            };

            _db.Statements.Add(newStatement);
            await _db.SaveChangesAsync();

            // Return 201 Created with the newly created statement
            return CreatedAtAction(
                nameof(GetStatementsByAccount), 
                new { accountId = newStatement.AccountId }, 
                newStatement
            );
        }
    }
}
