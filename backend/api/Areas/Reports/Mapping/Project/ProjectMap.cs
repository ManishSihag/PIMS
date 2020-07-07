using Mapster;
using Model = Pims.Api.Areas.Reports.Models.Project;
using Entity = Pims.Dal.Entities;
using Pims.Api.Mapping.Converters;

namespace Pims.Api.Areas.Reports.Mapping.Project
{
    public class ProjectMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.Project, Model.ProjectModel>()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.ProjectNumber, src => src.ProjectNumber)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.ReportedFiscalYear, src => src.ReportedFiscalYear)
                .Map(dest => dest.ActualFiscalYear, src => src.ActualFiscalYear)
                .Map(dest => dest.StatusId, src => src.StatusId)
                .Map(dest => dest.StatusCode, src => src.Status == null ? null : src.Status.Code)
                .Map(dest => dest.Status, src => src.Status == null ? null : src.Status.Name)
                .Map(dest => dest.TierLevelId, src => src.TierLevelId)
                .Map(dest => dest.TierLevel, src => src.TierLevel == null ? null : src.TierLevel.Name)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.Note, src => src.Note)
                .Map(dest => dest.PublicNote, src => src.PublicNote)
                .Map(dest => dest.PrivateNote, src => src.PrivateNote)
                .Map(dest => dest.AgencyResponseNote, src => src.AgencyResponseNote)
                .Map(dest => dest.AgencyId, src => src.AgencyId)
                .Map(dest => dest.Agency, src => AgencyConverter.ConvertAgency(src.Agency))
                .Map(dest => dest.SubAgency, src => AgencyConverter.ConvertSubAgency(src.Agency))
                .Map(dest => dest.ExemptionRequested, src => src.ExemptionRequested)
                .Map(dest => dest.ExemptionRationale, src => src.ExemptionRationale)
                .Map(dest => dest.NetBook, src => src.NetBook)
                .Map(dest => dest.Estimated, src => src.Estimated)
                .Map(dest => dest.Assessed, src => src.Assessed)
                .Map(dest => dest.UpdatedOn, src => src.UpdatedOn)
                .Map(dest => dest.UpdatedBy,
                    src => src.UpdatedById != null ? src.UpdatedBy.DisplayName : null)
                .Map(dest => dest.CreatedOn, src => src.CreatedOn)
                .Map(dest => dest.CreatedBy,
                    src => src.CreatedById != null ? src.CreatedBy.DisplayName : null)

                .Map(dest => dest.SubmittedOn, src => src.SubmittedOn)
                .Map(dest => dest.ApprovedOn, src => src.ApprovedOn)
                .Map(dest => dest.InitialNotificationSentOn, src => src.InitialNotificationSentOn)
                .Map(dest => dest.ThirtyDayNotificationSentOn, src => src.ThirtyDayNotificationSentOn)
                .Map(dest => dest.SixtyDayNotificationSentOn, src => src.SixtyDayNotificationSentOn)
                .Map(dest => dest.NinetyDayNotificationSentOn, src => src.NinetyDayNotificationSentOn)
                .Map(dest => dest.OnHoldNotificationSentOn, src => src.OnHoldNotificationSentOn)
                .Map(dest => dest.TransferredWithinGreOn, src => src.TransferredWithinGreOn)
                .Map(dest => dest.ClearanceNotificationSentOn, src => src.ClearanceNotificationSentOn)
                .Map(dest => dest.DeniedOn, src => src.DeniedOn)
                .Map(dest => dest.CancelledOn, src => src.CancelledOn)
                .Inherits<Entity.BaseEntity, Api.Models.BaseModel>();
        }
    }
}