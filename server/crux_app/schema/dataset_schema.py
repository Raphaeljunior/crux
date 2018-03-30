from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType
from graphql_extensions.auth.decorators import (login_required,
                                                staff_member_required)

from .file_schema import FileType, FileUploadType
from ..models import Dataset, File


class DatasetType(DjangoObjectType):
    class Meta:
        model = Dataset


class Query(graphene.ObjectType):
    all_datasets = graphene.List(DatasetType)

    @staff_member_required
    def resolve_all_datasets(self, info, **kwargs):
        return Dataset.objects.all()


class CreateDataset(graphene.Mutation):
    dataset = graphene.Field(DatasetType)

    class Arguments:
        name = graphene.String(required=True)
        files = FileUploadType()

    @login_required
    def mutate(self, info, name, **kwargs):
        up_files = []

        dataset = Dataset(
            name=name,
            owner=info.context.user,
            **kwargs
        )
        dataset.save()
        for f in info.context.FILES.getlist('files'):
            file = File(
                file=f,
                **kwargs
            )
            file.save()
            dataset.file_set.add(file)

        return CreateDataset(dataset=dataset)


class Mutation(graphene.ObjectType):
    create_dataset = CreateDataset.Field()