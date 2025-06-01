using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finwiz.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddColorHexToAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "Accounts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "Accounts");
        }
    }
}
