using System.ComponentModel.DataAnnotations.Schema;

namespace Finwiz.Server.Data.Models
{
    public class Statement
    {
        public Guid Id { get; set; }

        public required double Amount { get; set; }

        public required DateTime StatementStart { get; set; }

        public required DateTime StatementEnd { get; set; }

        public required DateTime PaymentDate { get; set; }

        public DateTime? DueDate { get; set; }

        public required bool IsPaid { get; set; }

        [ForeignKey("Account")]
        public Guid AccountId { get; set; }

        // Navigation property
        public virtual Account Account { get; set; } = null;
    }
}