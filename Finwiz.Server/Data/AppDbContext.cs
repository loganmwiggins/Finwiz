using Finwiz.Server.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Finwiz.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                .HasMany(a => a.Payments)   // One Account has many AccountPayments
                .WithOne(p => p.Account)    // One AccountPayment belongs to one Account
                .HasForeignKey(p => p.AccountId) // Foreign key in AccountPayment
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete payments when an account is deleted
        }

        // Tables
        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountPayment> AccountPayments { get; set; }
    }
}