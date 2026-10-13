using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using TaskManagementApi.Models;

namespace TaskManagementApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<TaskItem> Tasks => Set<TaskItem>();


        //it was storing 0s instead of todos.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskItem>().Property(t => t.Status).HasConversion<string>();
        }
    }
}
