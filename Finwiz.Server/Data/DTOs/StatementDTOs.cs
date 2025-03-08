using Microsoft.AspNetCore.Mvc;

namespace Finwiz.Server.Data.DTOs
{
    public class StatementDTOs
    {
       public class CreateStatementDTO
       {
            public required double Amount { get; set; }

            public required DateTime StatementStart { get; set; }

            public required DateTime StatementEnd { get; set; }

            public required DateTime PaymentDate { get; set; }

            public DateTime? DueDate { get; set; }

            public required bool IsPaid { get; set; }
        }
    }
}