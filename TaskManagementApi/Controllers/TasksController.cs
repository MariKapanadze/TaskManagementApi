using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Data;
using TaskManagementApi.DTOs;
using TaskManagementApi.Models;

namespace TaskManagementApi.Controllers;

[ApiController]
[Route("tasks")]

public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    public TasksController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll([FromQuery] TaskItemStatus? status)
    {
        var query = _db.Tasks.AsQueryable();
        if (status.HasValue) query = query.Where(t => t.Status == status.Value);
        return Ok(await query.OrderBy(t => t.DueDate).ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskItem>> GetById(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        return task is null ? NotFoundProblem(id) : Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> Create(TaskRequestDto dto)
    {
        if(dto.DueDate.Date < DateTime.UtcNow.Date)
        {
           ModelState.AddModelError(nameof(dto.DueDate), "Due date cannot be in the past.");
            return ValidationProblem(ModelState);
        }

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            AssignedTo = dto.AssignedTo,
            CreatedAt = DateTime.UtcNow,
            DueDate = dto.DueDate
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TaskItem>> Update(int id, TaskRequestDto dto)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFoundProblem(id);

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFoundProblem(id);

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private NotFoundObjectResult NotFoundProblem(int id) =>
        NotFound(new ProblemDetails
        {
            Status = 404,
            Title = "task not found",
            Detail = $"task with id {id} was not found"
        });


    //public IActionResult Index()
    //{
    //    return View();
    //}
}
