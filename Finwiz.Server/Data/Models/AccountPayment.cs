using System.ComponentModel.DataAnnotations.Schema;

namespace Finwiz.Server.Data.Models
{
    public class AccountPayment
    {
        public Guid Id { get; set; }

        public required double Amount { get; set; }

        public required DateOnly StatementStart { get; set; }

        public required DateOnly StatementEnd { get; set; }

        public required DateOnly PaymentDate { get; set; }

        public DateOnly? DueDate { get; set; }

        public required bool IsPaid { get; set; }

        [ForeignKey("Account")]
        public Guid AccountId { get; set; }
    }
}