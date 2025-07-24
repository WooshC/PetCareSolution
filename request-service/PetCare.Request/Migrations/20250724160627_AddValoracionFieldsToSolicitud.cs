using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetCare.Request.Migrations
{
    /// <inheritdoc />
    public partial class AddValoracionFieldsToSolicitud : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comentario",
                table: "Solicitudes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "Solicitudes",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comentario",
                table: "Solicitudes");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Solicitudes");
        }
    }
}
