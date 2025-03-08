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
                .HasMany(a => a.Statements)   // One Account has many Statements
                .WithOne(p => p.Account)    // One AccountPayment belongs to one Account
                .HasForeignKey(p => p.AccountId) // Foreign key in AccountPayment
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete payments when an account is deleted
        }

        // Tables
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Statement> Statements { get; set; }
    }
}