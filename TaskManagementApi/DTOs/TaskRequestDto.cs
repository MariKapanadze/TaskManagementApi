using Microsoft.OpenApi.MicrosoftExtensions;
using System.ComponentModel.DataAnnotations;
using TaskManagementApi.Models;

namespace TaskManagementApi.DTOs
{
    public class TaskRequestDto
    {
        [Required(ErrorMessage = "Title is required" )]
        [StringLength( 100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters" )]
        public string Title { get; set; } = string.Empty;


        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }


        [EnumDataType(typeof(TaskItemStatus), ErrorMessage = "status must be Todo, InProgress, or Done")]
        public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;


        [Required(ErrorMessage = "AssignedTo is required")]
        public string AssignedTo { get; set; } = string.Empty;


        [Required(ErrorMessage = "DueDate is required")]
        public DateTime? DueDate { get; set; }
    }
}
