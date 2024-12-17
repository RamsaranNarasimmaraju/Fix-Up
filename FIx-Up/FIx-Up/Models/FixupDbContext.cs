using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FIx_Up.Models;

public partial class FixupDbContext : DbContext
{
    public FixupDbContext()
    {
    }

    public FixupDbContext(DbContextOptions<FixupDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CustomIssue> CustomIssues { get; set; }

    public virtual DbSet<Dashboard> Dashboards { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Issue> Issues { get; set; }

    public virtual DbSet<Login> Logins { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Solution> Solutions { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-5RJDN9Q;Database=FixupDb;Trusted_Connection=True;TrustServerCertificate=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomIssue>(entity =>
        {
            entity.HasKey(e => e.CustomId).HasName("PK__CustomIs__EC6CBE52B079AE9F");

            entity.ToTable("CustomIssue");

            entity.Property(e => e.CustomId).HasColumnName("CustomID");
            entity.Property(e => e.CustomSolution).HasMaxLength(100);
            entity.Property(e => e.CutomIssue).HasMaxLength(100);

            entity.HasOne(d => d.User).WithMany(p => p.CustomIssues)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("FK__CustomIss__Useri__5CD6CB2B");
        });

        modelBuilder.Entity<Dashboard>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("Dashboard");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD6A330067E");

            entity.ToTable("Feedback");

            entity.Property(e => e.Comments).HasColumnName("comments");
            entity.Property(e => e.Submitteddate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("submitteddate");
            entity.Property(e => e.TicketId).HasColumnName("TicketID");

            entity.HasOne(d => d.Ticket).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.TicketId)
                .HasConstraintName("FK__Feedback__Ticket__4E88ABD4");
        });

        modelBuilder.Entity<Issue>(entity =>
        {
            entity.HasKey(e => e.IssueId).HasName("PK__Issues__6C861624F69FA245");

            entity.Property(e => e.IssueId).HasColumnName("IssueID");
            entity.Property(e => e.IssueCategory).HasMaxLength(100);
        });

        modelBuilder.Entity<Login>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Login");

            entity.Property(e => e.UserName).HasMaxLength(20);
            entity.Property(e => e.UserPassword).HasMaxLength(50);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__roles__8AFACE1A56D3C1E0");

            entity.ToTable("roles");

            entity.HasIndex(e => e.RoleName, "UQ__roles__8A2B6160F8C121DF").IsUnique();

            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<Solution>(entity =>
        {
            entity.HasKey(e => e.SolutionId).HasName("PK__Solution__6B633AF06149E9BD");

            entity.Property(e => e.SolutionId).HasColumnName("SolutionID");
            entity.Property(e => e.IssueId).HasColumnName("IssueID");
            entity.Property(e => e.Solution1).HasColumnName("Solution");

            entity.HasOne(d => d.Issue).WithMany(p => p.Solutions)
                .HasForeignKey(d => d.IssueId)
                .HasConstraintName("FK__Solutions__Issue__628FA481");
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__Tickets__712CC607E985A902");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IssueType).HasMaxLength(50);
            entity.Property(e => e.ResolvedDate).HasColumnType("datetime");
            entity.Property(e => e.Tstatus)
                .HasMaxLength(50)
                .HasDefaultValue("open")
                .HasColumnName("TStatus");

            entity.HasOne(d => d.User).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Tickets__UserId__4316F928");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__1788CC4C29852C34");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "UQ__users__A9D10534F2975C71").IsUnique();

            entity.HasIndex(e => e.UserName, "UQ__users__C9F28456F04048B0").IsUnique();

            entity.Property(e => e.DateCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.UserName).HasMaxLength(20);
            entity.Property(e => e.UserPassword)
                .HasMaxLength(70)
                .HasColumnName("userPassword");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__users__RoleId__3D5E1FD2");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
